import { inject, onServerPrefetch } from '@vue/runtime-core'
import { onBeforeMount } from 'vue'
import type { Composer } from 'vue-i18n'
import type { Extension } from './extension'
import {
  type ConcatKeys,
  ExtensionKey,
  type Tail,
  type TranslateParams,
} from './internal'
import type { ModuleName, ModuleT } from './types'

/**
 * ModuleTranslateFn is a function that takes a key and optional arguments and
 * returns a localized message. It utilizes vue-i18n's `t` function for
 * translation.
 */
export type ModuleTranslateFn<Name extends ModuleName> = (
  key: ConcatKeys<ModuleT<Name>>,
  ...args: Partial<Tail<TranslateParams<Composer>>>
) => string

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
): UseMessagesReturn<Name> {
  return _useMessages(module, options)
}

function _useMessages<Name extends ModuleName>(
  module: Name,
  options?: { load?: boolean },
) {
  const load = options?.load ?? true

  const {
    i18n,
    loadModule,
    moduleLoaded,
    moduleNamespace,
    translate: _translate,
    debugLog,
  } = useExtension()

  function messageNamespace<Key extends ConcatKeys<ModuleT<Name>>>(key: Key) {
    return moduleNamespace(module, key)
  }

  /**
   * Translates a key of the module to a localized message. vue-i18n's `t`
   * function is used to translate the message, so you can pass the same
   * parameters that you would pass to vue-i18n's `t` function.
   */
  const translate: ModuleTranslateFn<Name> = (
    key: ConcatKeys<ModuleT<Name>>,
    ...args: Partial<Tail<TranslateParams<typeof i18n.value>>>
  ) => _translate(module, key, ...(args as []))

  async function init() {
    if (!load) {
      return
    }

    if (moduleLoaded(module)) {
      debugLog(`[useMessages] "${module}" module already loaded.`)
      return
    }

    debugLog(
      `[useMessages] "${module}" module not loaded yet. Loading messages ...`,
    )

    try {
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

  onServerPrefetch(init)
  onBeforeMount(init)

  return {
    messageNamespace,
    translate,
    t: translate,
  }
}

/**
 * Returns the "translate" function for a specific message module. The
 * "translate" function translates a key of the module to a localized message
 * using vue-i18n's `t` function. This function can be used to pass the same
 * parameters that you would pass to vue-i18n's `t` function. If the message
 * module is not loaded yet, it will be loaded server-side within
 * `onServerPrefetch`, or client-side within `onBeforeMount`. \/
 * UseMessagesReturn<Name>
 */
export type UseMessagesReturn<Name extends ModuleName> = ReturnType<
  typeof _useMessages<Name>
>
