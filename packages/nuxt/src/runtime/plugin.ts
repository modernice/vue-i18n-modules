import type { ModuleName } from '@modernice/vue-i18n-modules'
import type { ModuleOptions } from '../module'
import { createExtension, createPlugin } from '@modernice/vue-i18n-modules'
import { addRouteMiddleware, defineNuxtPlugin, useNuxtApp, useState } from '#app'
import { loader } from '#build/i18n-modules.loader.mjs'
import options from '#build/i18n-modules.options.mjs'
import { InitialModulesMiddleware, MessagesMiddleware } from '../middleware'

type LoadedModulesState = Record<string, ModuleName[]>

const LoadedModulesStateKey = 'i18n-modules:loaded'

export default defineNuxtPlugin({
  dependsOn: ['i18n:plugin'],

  async setup({ vueApp }) {
    const opts = options as ModuleOptions

    const { $i18n } = useNuxtApp()
    const loadedModules = useState<LoadedModulesState>(
      LoadedModulesStateKey,
      () => ({}),
    )

    function rememberLoadedModule(locale: string, module: ModuleName) {
      const modules = loadedModules.value[locale] ?? []

      if (modules.includes(module)) {
        return
      }

      loadedModules.value = {
        ...loadedModules.value,
        [locale]: [...modules, module],
      }
    }

    const extension = createExtension({
      i18n: $i18n,
      loader,
      ...opts,
      onModuleLoaded({ locale, module }) {
        if (import.meta.server) {
          rememberLoadedModule(locale, module)
        }
      },
    })

    if (import.meta.client) {
      await Promise.all(
        Object.entries(loadedModules.value).flatMap(([locale, modules]) =>
          modules.map((mod) => extension.loadModule(mod, { locales: [locale] })),
        ),
      )
    }

    const plugin = createPlugin(extension)
    vueApp.use(plugin)

    addRouteMiddleware(MessagesMiddleware, async (to) => {
      const { loadModule } = extension
      const translateOption = (to.matched[0]?.meta.messages ?? []) as
        | ModuleName
        | ModuleName[]

      const modules = Array.isArray(translateOption)
        ? translateOption
        : [translateOption]

      if (!modules.length) {
        return
      }

      try {
        await Promise.all(modules.map((mod) => loadModule(mod)))
      } catch (e) {
        console.error(
          `[vue-i18n-modules] Failed to load message modules: ${
            (e as Error).message
          }`,
        )
      }
    })

    addRouteMiddleware(
      InitialModulesMiddleware,
      async () => {
        if (!opts.initial.length) {
          return
        }

        const { loadModule } = extension

        try {
          await Promise.all(opts.initial.map((mod) => loadModule(mod)))
        } catch (e) {
          console.error(
            `[nuxt-i18n-modules] Failed to load initial message modules: ${
              (e as Error).message
            }`,
          )
        }
      },
      { global: true },
    )
  },
})
