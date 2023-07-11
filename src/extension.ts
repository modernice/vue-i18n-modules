import type { Composer } from 'vue-i18n'
import type { ModuleLoader, ModuleName, ModuleT } from './types.js'
import { type InjectionKey, ref } from '@vue/runtime-core'
import { computed } from '@vue/reactivity'
import type { ConcatKeys, Tail, TranslateParams } from './internal.js'

/**
 * {@link InjectionKey} for the extension.
 */
export const ExtensionKey = 'i18n.modules'

/**
 * A vue-i18n extension that provides namespaced lazy message loading.
 */
export type Extension = ReturnType<typeof createExtension>

/**
 * Options for creating the {@link Extension | extension}.
 */
export interface Options {
  /**
   * The vue-i18n {@link Composer} instance, as returned by {@link useI18n}.
   */
  i18n: Composer

  /**
   * Module loader to use.
   */
  loader: ModuleLoader

  /**
   * Namespace to use when adding messages to the vue-i18n instance.
   *
   * @default '__modules'
   */
  namespace?: string

  /**
   * Enable debugging logs.
   */
  debug?: boolean
}

/**
 * Creates the {@link Extension | extension} for namespaced messages.
 */
export function createExtension(options: Options) {
  function debugLog(message: string) {
    if (options.debug) {
      console.debug(`[vue-i18n-modules] ${message}`)
    }
  }

  /**
   * The vue-i18n {@link Composer} instance.
   */
  const i18n = computed(() => options.i18n)

  /**
   * Namespace of the extension under which the message modules are registered.
   */
  const namespace = computed(() => options.namespace || '__modules')

  const loadedModules = ref(new Set<ModuleName>())

  /**
   * Loads and registers the messages of a module.
   */
  async function loadModule(
    module: ModuleName,
    opts?: {
      /**
       * If provided, the module is loaded for all given locales.
       * Otherwise, the module is loaded for the currently active locale.
       */
      locales?: string[]
    }
  ) {
    const { mergeLocaleMessage, locale: activeLocale } = options.i18n

    const locales = opts?.locales || [activeLocale.value]

    debugLog(`Trying to load ${module} module (${locales.join(', ')}) ...`)

    for (const locale of locales) {
      const path = `${module}/${locale}.json`

      try {
        debugLog(`Trying to load module from "${path}" ...`)

        const mod = await options.loader({
          path,
          module,
        })

        debugLog(
          `Merging messages of "${module}" module (${locale}) into vue-i18n ...`
        )

        mergeLocaleMessage(locale, {
          [namespace.value]: { [module]: mod },
        })
      } catch (e) {
        debugLog(`Failed to load "${module}" module: ${(e as Error).message}`)

        console.warn(
          `[vue-i18n-modules] Failed to load messages from path "${path}": ${
            (e as Error).message
          }`
        )
      }

      loadedModules.value.add(module)
    }
  }

  /**
   * Returns whether the given message module has been loaded yet.
   */
  function moduleLoaded(name: ModuleName) {
    return loadedModules.value.has(name)
  }

  /**
   * Translates a key of the given module to a localized message.
   * vue-i18n's `t` function is used to translate the message, so you can pass
   * the same parameters that you would pass to vue-i18n's `t` function.
   */
  function translate<
    Name extends ModuleName,
    Key extends ConcatKeys<Mod>,
    Mod = ModuleT<Name>
  >(
    module: Name,
    key: Key,
    ...args: Partial<Tail<TranslateParams<typeof options.i18n>>>
  ) {
    const { t } = options.i18n
    const _key = `${namespace.value}.${module}.${key}`

    let translated = t(_key, ...(args as []))

    // In production, vue-i18n doesn't replace named parameters in the messages
    // for some reason, so we do it manually here.
    const named = args?.[0] ?? {}
    for (const [name, value] of Object.entries(named)) {
      translated = translated.replaceAll(`{${name}}`, String(value))
    }

    return translated
  }

  return {
    i18n,
    namespace,
    loadModule,
    moduleLoaded,
    translate,
    t: translate,
    debugLog,
  }
}
