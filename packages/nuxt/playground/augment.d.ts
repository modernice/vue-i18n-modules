import type { Foo } from './dictionary/foo'
import type { Bar } from './dictionary/bar'
import type { Baz } from './dictionary/baz'
import type { ObjectArray } from './dictionary/object-array'

declare module '@modernice/vue-i18n-modules' {
  export interface DefineModules {
    foo: Foo
    bar: Bar
    baz: Baz
    'object-array': ObjectArray
  }
}
