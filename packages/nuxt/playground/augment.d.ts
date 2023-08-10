import type { Foo } from './dictionary/foo'
import type { Bar } from './dictionary/bar'

declare module '@modernice/vue-i18n-modules' {
  export interface DefineModules {
    foo: Foo
    bar: Bar
  }
}
