import type { ModuleName } from '@modernice/vue-i18n-modules'

declare module '#app' {
  interface PageMeta {
    /**
     * The message modules to load in 'i18n:messages' middleware.
     */
    messages?: ModuleName[] | ModuleName
  }
}
