import type { ModuleName, Options } from '@modernice/vue-i18n-modules'
import { join, relative } from 'node:path'
import {
  addImports,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  resolvePath,
} from '@nuxt/kit'
import { omit } from 'lodash-es'
import { withLeadingSlash } from 'ufo'

const DICTIONARY_ALIAS = '#i18n-dictionary'

/**
 * ModuleOptions is an interface that extends the Options interface from the
 * `@modernice/vue-i18n-modules` package. It defines additional properties for
 * configuring the module. The `dictionary` property is a string representing
 * the path to the dictionary. The `initial` property is an array of ModuleName
 * representing the modules to load initially for every page.
 */
export interface ModuleOptions extends Omit<Options, 'i18n' | 'loader'> {
  /**
   * Path to the dictionary, which can be:
   * - A relative path (e.g., './dictionary', '../../external-dictionary/dictionary')
   * - A package path (e.g., '@modernice/external-dictionary/dictionary')
   */
  dictionary: string

  /**
   * Modules to load initially for every page.
   */
  initial: ModuleName[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@modernice/nuxt-i18n-modules',
    configKey: 'i18nModules',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },

  defaults: {
    dictionary: './dictionary', // relative to the root of the project
    initial: [],
  },

  moduleDependencies: {
    '@nuxtjs/i18n': {},
  },

  async setup(options, nuxt) {
    options.dictionary = options.dictionary.replace(/\/+$/, '')

    if (!options.dictionary) {
      throw new Error('[nuxt-i18n-modules] No dictionary path specified.')
    }

    const resolver = createResolver(import.meta.url)
    const root = nuxt.options.rootDir

    // Resolve the dictionary path
    // - Relative paths (starting with . or /) are resolved using Nuxt's resolvePath
    // - Package paths (e.g., '@scope/package/path') are resolved from node_modules
    const isRelativePath =
      options.dictionary.startsWith('.') || options.dictionary.startsWith('/')
    const absoluteDictionaryDir = isRelativePath
      ? await resolvePath(options.dictionary)
      : join(root, 'node_modules', options.dictionary)

    const relativePath = relative(root, absoluteDictionaryDir)

    // Check if the dictionary is in node_modules or outside the app directory
    // In these cases, we need to use a Vite alias
    const isExternalDictionary =
      relativePath.startsWith('node_modules') ||
      relativePath.startsWith('..') ||
      relativePath.startsWith('/') // absolute path outside project

    // Compute the prefix based on the path relative from .nuxt directory
    // This is what Vite's import.meta.glob will return as keys
    const nuxtDir = join(root, '.nuxt')
    const relativeFromNuxt = relative(nuxtDir, absoluteDictionaryDir)
    const globPrefix = withLeadingSlash(relativeFromNuxt)

    if (isExternalDictionary) {
      // Add a Vite alias for the dictionary directory
      // This allows import.meta.glob to work with paths outside the app directory
      nuxt.options.alias[DICTIONARY_ALIAS] = absoluteDictionaryDir

      // Also configure Vite to resolve this alias and allow access to external paths
      nuxt.hook('vite:extendConfig', (config) => {
        if (!config.resolve) {
          ;(config as { resolve: object }).resolve = {}
        }
        if (!config.resolve!.alias) {
          config.resolve!.alias = {}
        }

        if (Array.isArray(config.resolve!.alias)) {
          config.resolve!.alias.push({
            find: DICTIONARY_ALIAS,
            replacement: absoluteDictionaryDir,
          })
        } else {
          ;(config.resolve!.alias as Record<string, string>)[DICTIONARY_ALIAS] =
            absoluteDictionaryDir
        }

        // Allow Vite to access files outside the project root (for external dictionaries)
        if (!config.server) {
          ;(config as { server: object }).server = {}
        }
        if (!config.server!.fs) {
          ;(config.server as { fs: object }).fs = {}
        }
        const fs = config.server!.fs as { allow?: string[] }
        if (!fs.allow) {
          fs.allow = []
        }
        // Add the dictionary directory and its parent to the allow list
        fs.allow.push(absoluteDictionaryDir)
      })
    }

    // Use alias for external dictionaries, relative path for internal ones
    const globPath = isExternalDictionary
      ? DICTIONARY_ALIAS
      : withLeadingSlash(relativePath)

    addTemplate({
      getContents: () => {
        // Compute the prefix - for internal dictionaries use the relative path from root,
        // for external dictionaries use the path relative from .nuxt directory
        const prefix = isExternalDictionary
          ? globPrefix
          : withLeadingSlash(relativePath)

        return `import { createGlobLoader } from '@modernice/vue-i18n-modules/vite'

export const loader = createGlobLoader(import.meta.glob('${globPath}/**/*.json'), {
  prefix: '${prefix}/',
})
`
      },
      filename: 'i18n-modules.loader.mjs',
      write: true,
    })

    addTemplate({
      getContents: () =>
        `export default ${JSON.stringify(
          omit(options, 'dictionary'),
          null,
          2,
        )}\n`,
      filename: 'i18n-modules.options.mjs',
      write: true,
    })

    addTypeTemplate({
      src: resolver.resolve('runtime/types/augment.d.ts'),
      filename: 'types/i18n-modules.d.ts',
    })

    addPlugin(resolver.resolve('runtime/plugin'))

    addImports([
      {
        name: 'useExtension',
        from: '@modernice/vue-i18n-modules',
      },
      {
        name: 'useMessages',
        from: '@modernice/vue-i18n-modules',
      },
    ])
  },
})
