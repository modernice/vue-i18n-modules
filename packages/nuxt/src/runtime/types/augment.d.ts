import type { ModuleName } from '@modernice/vue-i18n-modules'

declare module 'nuxt/app' {
  export interface PageMeta {
    /**
     * The message modules to load in 'i18n:messages' middleware.
     */
    messages?: ModuleName[] | ModuleName
  }
}

declare module '@nuxt/schema' {
  export interface RuntimeConfig {
    i18nModules: {
      initial: ModuleName[]
    }
  }
}
