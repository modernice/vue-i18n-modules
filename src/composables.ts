import { inject, onMounted, onServerPrefetch } from '@vue/runtime-core'
import { type Extension, ExtensionKey } from './extension.js'
import { ConcatKeys, Tail, TranslateParams } from './internal.js'
import type { ModuleName, ModuleT } from './types.js'

/**
 * Returns the namespaced messages {@link Extension | extension}.
 */
export function useExtension(): Extension {
  const translator = inject<Extension>(ExtensionKey)

  if (!translator) {
    throw new Error(`[vue-i18n-modules] Extension is not installed.`)
  }

  return translator
}

/**
 * Returns the "translate" function for a specific message module.
 */
export function useMessages<Name extends ModuleName>(
  module: Name,
  options?: {
    /**
     * If set to `true`, the message module will be loaded server-side within
     * {@link onServerPrefetch}, or client-side within {@link onMounted}.
     */
    load?: boolean
  }
) {
  const {
    i18n,
    namespace,
    loadModule,
    moduleLoaded,
    translate: _translate,
    debugLog,
  } = useExtension()

  /**
   * Translates a key of the module to a localized message. vue-i18n's `t`
   * function is used to translate the message, so you can pass the same
   * parameters that you would pass to vue-i18n's `t` function.
   */
  function translate<Key extends ConcatKeys<Mod>, Mod = ModuleT<Name>>(
    key: Key,
    ...args: Partial<Tail<TranslateParams<typeof i18n.value>>>
  ) {
    const { t } = i18n.value
    const _key = `${namespace.value}.${module}.${key}`
    return t(_key, ...(args as []))
  }

  async function init() {
    if (!options?.load) {
      return
    }

    if (!moduleLoaded(module)) {
      debugLog(
        `[useMessages] "${module}" module not loaded yet. Loading messages ...`
      )

      try {
        await loadModule(module)
      } catch (e) {
        debugLog(
          `[useMessages] Failed to load "${module}" module: ${
            (e as Error).message
          }`
        )

        console.warn(
          `[vue-i18n-modules] Failed to "${module}" module: ${
            (e as Error).message
          }`
        )
      }
    }
  }

  onServerPrefetch(init)
  onMounted(init)

  return {
    translate,
    t: translate,
  }
}
