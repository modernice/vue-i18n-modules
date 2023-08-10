import { inject, onServerPrefetch } from '@vue/runtime-core'
import { onBeforeMount } from 'vue'
import { type Extension } from './extension'
import {
  type ConcatKeys,
  ExtensionKey,
  type Tail,
  type TranslateParams,
} from './internal'
import type { ModuleName, ModuleT } from './types'

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
     *
     * @default true
     */
    load?: boolean
  },
) {
  const load = options?.load ?? true

  const {
    i18n,
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
  function translate<Key extends ConcatKeys<ModuleT<Name>>>(
    key: Key,
    ...args: Partial<Tail<TranslateParams<typeof i18n.value>>>
  ) {
    return _translate(module, key, ...(args as []))
  }

  async function init() {
    if (!load) {
      return
    }

    if (!moduleLoaded(module)) {
      debugLog(
        `[useMessages] "${module}" module not loaded yet. Loading messages ...`,
      )

      try {
        debugLog(`Loading "${module}" module ...`)
        await loadModule(module)
        debugLog(`Module "${module}" loaded successfully.`)
      } catch (e) {
        debugLog(
          `[useMessages] Failed to load "${module}" module: ${
            (e as Error).message
          }`,
        )

        console.warn(
          `[vue-i18n-modules] Failed to load "${module}" module: ${
            (e as Error).message
          }`,
        )
      }
    }
  }

  onServerPrefetch(init)
  onBeforeMount(init)

  return {
    translate,
    t: translate,
  }
}
