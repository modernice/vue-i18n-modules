import type bar from './bar'
import type foo from './foo'

declare module '@modernice/vue-i18n-modules' {
  export interface DefineModules {
    foo: typeof Foo
    bar: typeof bar
  }
}
