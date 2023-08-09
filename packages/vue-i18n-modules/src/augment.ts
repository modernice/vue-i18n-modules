/**
 * Define types of message modules in this interface.
 *
 * @example
 * ```ts
 * import type foo from './modules/foo/en.json'
 * import type bar from './modules/bar/en.json'
 * import type baz from './modules/baz/en.json'
 *
 * declare module '@modernice/vue-i18n-modules' {
 *   interface DefineModules {
 *     foo: typeof foo
 *     bar: typeof bar
 *     baz: typeof baz
 *   }
 * }
 * ```
 */
export interface DefineModules {}
