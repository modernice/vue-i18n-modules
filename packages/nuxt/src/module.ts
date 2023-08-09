import { relative } from 'node:path'
import { type ModuleName } from '@modernice/vue-i18n-modules'
import {
  addImports,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

export interface ModuleOptions {
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
  },

  defaults: {
    dictionary: './dictionary', // relative to the root of the project
    initial: [],
  },

  async setup(options, nuxt) {
    options.dictionary = options.dictionary.replace(/\/+?$/, '')

    if (!options.dictionary) {
      throw new Error('[nuxt-i18n-modules] No dictionary path specified.')
    }

    const resolver = createResolver(import.meta.url)

    const root = nuxt.options.rootDir
    const buildDir = nuxt.options.buildDir
    const absoluteDictionaryDir = createResolver(root).resolve(
      options.dictionary,
    )
    const dictionaryDir = relative(buildDir, absoluteDictionaryDir)

    addTemplate({
      getContents:
        () => `import { createGlobLoader } from '@modernice/vue-i18n-modules/vite'

export const loader = createGlobLoader(import.meta.glob('${dictionaryDir}/**/*.json'), {
  prefix: '${dictionaryDir}/',
})
`,
      filename: 'i18n.loader.mjs',
      write: true,
    })

    addTemplate({
      getContents: () =>
        `export default ${JSON.stringify(
          { initial: options.initial },
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
