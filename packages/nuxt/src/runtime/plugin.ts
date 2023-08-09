import type { ModuleName } from '@modernice/vue-i18n-modules'
import { createExtension, createPlugin } from '@modernice/vue-i18n-modules'
import { createI18n } from 'vue-i18n'
import type { ModuleOptions } from '../module'
import { addRouteMiddleware, defineNuxtPlugin } from '#app'
import { loader } from '#build/i18n-modules.loader.mjs'
import options from '#build/i18n-modules.options.mjs'

/**
 * The name of the middleware that loads message modules.
 */
export const MessagesMiddleware = 'i18n:messages'

/**
 * The name of the global middleware that loads initial message modules.
 */
export const InitialModulesMiddleware = 'i18n:initial'

export default defineNuxtPlugin((app) => {
  const opts = options as ModuleOptions

  const { vueApp } = app

  const i18n = createI18n({
    legacy: false,
    messages: {},
    locale: 'en',
  })

  vueApp.use(i18n)

  const extension = createExtension({
    i18n: i18n.global,
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
})
