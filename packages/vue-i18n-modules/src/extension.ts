import { ref } from '@vue/runtime-core'
import { computed } from '@vue/reactivity'
import type { Composer } from 'vue-i18n'
import type { ConcatKeys, Tail, TranslateParams } from './internal'
import type { Dictionary, ModuleLoader, ModuleName, ModuleT } from './types'

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
  const loadedModules = ref(new Map<string, Set<ModuleName>>())

  async function mergeMessages(
    locale: string,
    module: string,
    messages: Dictionary,
  ) {
    const { mergeLocaleMessage } = options.i18n

    mergeLocaleMessage(locale, {
      [namespace.value]: { [module]: messages },
    })
  }

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
    },
  ) {
    const { locale: activeLocale } = options.i18n

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

        await mergeMessages(locale, module, mod)
      } catch (e) {
        debugLog(`Failed to load "${module}" module: ${(e as Error).message}`)

        console.warn(
          `[vue-i18n-modules] Failed to load messages from path "${path}": ${
            (e as Error).message
          }`,
        )
      }

      if (!loadedModules.value.has(locale)) {
        loadedModules.value.set(locale, new Set<ModuleName>())
      }

      loadedModules.value.get(locale)?.add(module)
    }
  }

  /**
   * Returns whether the given message module has been loaded yet in the given locale.
   * If no locale is provided, the currently active locale is checked.
   */
  function moduleLoaded(name: ModuleName, locale?: string) {
    locale = locale || options.i18n.locale.value

    if (!loadedModules.value.has(locale)) {
      loadedModules.value.set(locale, new Set<ModuleName>())
    }

    return loadedModules.value.get(locale)?.has(name) ?? false
  }

  /**
   * Translates a key of the given module to a localized message.
   * vue-i18n's `t` function is used to translate the message, so you can pass
   * the same parameters that you would pass to vue-i18n's `t` function.
   */
  function translate<Name extends ModuleName>(
    module: Name,
    key: ConcatKeys<ModuleT<Name>>,
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

  /**
   * Loads the message modules for the given locale(s) by loading all message
   * modules that were previously loaded for the current locale (or the given
   * source locale).
   *
   * This function should be called before changing the locale of vue-i18n.
   */
  async function localize(
    locale: string | string[],
    options?: {
      /**
       * The source locale. Only messages that were loaded for this locale will
       * be loaded for the provided target locale(s).
       *
       * If not provided, the currently active locale is used.
       */
      from?: string
    },
  ) {
    const locales = Array.isArray(locale) ? locale : [locale]
    const from = options?.from || i18n.value.locale.value
    const source = loadedModules.value.get(from)

    await Promise.all(
      [...(source?.values() ?? [])].map((name) =>
        loadModule(name, { locales }),
      ),
    )
  }

  return {
    i18n,
    namespace,
    loadModule,
    moduleLoaded,
    localize,
    translate,
    t: translate,
    debugLog,
  }
}
