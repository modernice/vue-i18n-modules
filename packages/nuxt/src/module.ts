import type { ModuleName, Options } from '@modernice/vue-i18n-modules'
import { relative } from 'node:path'
import {
  addImports,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { omit } from 'lodash-es'
import { withLeadingSlash } from 'ufo'

/**
 * ModuleOptions is an interface that extends the Options interface from the
 * `@modernice/vue-i18n-modules` package. It defines additional properties for
 * configuring the module. The `dictionary` property is a string representing
 * the path to the dictionary. The `initial` property is an array of ModuleName
 * representing the modules to load initially for every page.
 */
export interface ModuleOptions extends Omit<Options, 'i18n' | 'loader'> {
  /**
   * Path to the dictionary.
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
    const absoluteDictionaryDir = createResolver(root).resolve(
      options.dictionary,
    )

    // This _should_ be absolute from the root (rootDir) directory
    // but for some reason it is treated as absolute from the app (srcDir).
    // This means that the dictionary _has_ to be placed somewhere inside the app (srcDir).
    // Is this a bug in Nuxt?
    const absoluteFromApp = withLeadingSlash(
      relative(root, absoluteDictionaryDir),
    )

    addTemplate({
      getContents:
        () => `import { createGlobLoader } from '@modernice/vue-i18n-modules/vite'

export const loader = createGlobLoader(import.meta.glob('${absoluteFromApp}/**/*.json'), {
  prefix: '${absoluteFromApp}/',
})
`,
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
