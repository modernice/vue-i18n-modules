import { addRouteMiddleware, defineNuxtPlugin } from '#app'
import type { ModuleName } from '../types.js'
import {
  type Extension,
  type Options as BaseOptions,
  createExtension as _createExtension,
} from '../extension.js'
import { createPlugin } from '../plugin.js'

/**
 * The name of the middleware that loads message modules.
 */
export const MessagesMiddleware = 'messages'

/**
 * The name of the global middleware that loads initial message modules.
 */
export const InitialModulesMiddleware = 'initial-modules'

/**
 * Options for creating the {@link Extension | extension} and Nuxt plugin.
 */
export interface Options extends BaseOptions, PluginOptions {}

export function createExtension(options: Options) {
  return createNuxtPlugin(_createExtension(options), options)
}

/**
 * Options for creating the Nuxt plugin.
 */
export interface PluginOptions {
  /**
   * Initial modules are loaded within a global middleware.
   */
  initial?: ModuleName[]
}

export function createNuxtPlugin(
  extension: Extension,
  options?: PluginOptions
) {
  const plugin = createPlugin(extension)

  return defineNuxtPlugin(({ vueApp }) => {
    vueApp.use(plugin)

    addRouteMiddleware(MessagesMiddleware, async (to) => {
      const { loadModule } = extension

      const translateOption = to.matched[0].meta.translate || []
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
          }`
        )
      }
    })

    addRouteMiddleware(
      InitialModulesMiddleware,
      async () => {
        const initial = options?.initial || []

        if (!initial.length) {
          return
        }

        const { loadModule } = extension

        try {
          await Promise.all(initial.map((mod) => loadModule(mod)))
        } catch (e) {
          console.error(
            `[vue-i18n-modules] Failed to load initial message modules: ${
              (e as Error).message
            }`
          )
        }
      },
      { global: true }
    )
  })
}
