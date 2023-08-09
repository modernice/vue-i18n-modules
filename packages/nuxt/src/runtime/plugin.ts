import type { ModuleName } from '@modernice/vue-i18n-modules'
import { createExtension, createPlugin } from '@modernice/vue-i18n-modules'
import type { ModuleOptions } from '../module'
import { InitialModulesMiddleware, MessagesMiddleware } from '../module'
import { addRouteMiddleware, defineNuxtPlugin, useNuxtApp } from '#app'
import { loader } from '#build/i18n-modules.loader.mjs'
import options from '#build/i18n-modules.options.mjs'

export default defineNuxtPlugin({
  // Must run after @nuxtjs/i18n!
  enforce: 'post',

  setup({ vueApp }) {
    const opts = options as ModuleOptions

    const { $i18n } = useNuxtApp()

    const extension = createExtension({
      i18n: $i18n,
      loader,
      ...opts,
    })

    const plugin = createPlugin(extension)
    vueApp.use(plugin)

    addRouteMiddleware(MessagesMiddleware, async (to) => {
      const { loadModule } = extension
      const translateOption = (to.matched[0].meta.messages ?? []) as
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
          `[vue-i18n-modules] Failed to load message modules: ${(e as Error).message
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
            `[nuxt-i18n-modules] Failed to load initial message modules: ${(e as Error).message
            }`,
          )
        }
      },
      { global: true },
    )
  },
})
