import type { Bar, Baz, Foo, ObjectArray } from '@modernice/external-dictionary'

declare module '@modernice/vue-i18n-modules' {
  export interface DefineModules {
    foo: Foo
    bar: Bar
    baz: Baz
    'object-array': ObjectArray
  }
}
