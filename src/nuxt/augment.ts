import type { ModuleName } from '../types'
export {}

declare module '#app' {
  interface PageMeta {
    translate?: ModuleName | ModuleName[]
  }
}
