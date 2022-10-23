import type { ModuleName } from '../types.js'
export {}

declare module '#app' {
  interface PageMeta {
    translate?: ModuleName | ModuleName[]
  }
}
