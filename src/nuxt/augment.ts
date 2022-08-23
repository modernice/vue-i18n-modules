import type { ModuleName } from '../types.js'

declare module 'nuxt/dist/pages/runtime/composables' {
  interface PageMeta {
    translate?: ModuleName | ModuleName[]
  }
}
