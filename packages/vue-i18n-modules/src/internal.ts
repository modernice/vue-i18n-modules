import type { DefineModules } from './augment'
import type { Dictionary } from './types'

/**
 * The InjectionKey used for injecting the extension into the Vue app.
 */
export const ExtensionKey = '@modernice/vue-i18n-modules'

/**
 * Recursively extracts the keys of type `T`, prepending the parent key to the
 * current key, separated by `Separator`.
 *
 * @example
 * ```ts
 * type Example = {
 *   foo: { bar: { baz: 'hello' } },
 *   a: { b: { foo: 1, bar: 2 } },
 * }
 *
 * type Keys = ConcatKeys<Example, '.'>
 *
 * Keys == 'foo' | 'foo.bar' | 'foo.bar.baz' | 'a' | 'a.b' | 'a.b.foo' | 'a.b.bar'
 * ```
 */
export type ConcatKeys<
  T,
  Separator extends string = '.',
  Prefix extends string = '',
> = keyof DefineModules extends never
  ? string
  : T extends Dictionary
  ? {
      [K in keyof T]:
        | `${Prefix}${K & string}`
        | ConcatKeys<T[K], Separator, `${Prefix}${K & string}${Separator}`>
    }[keyof T]
  : never

/**
 * TranslateParams is a type that represents the parameters of a translation
 * function. It extracts the parameter types from the "t" property of the
 * "Global" object. If "Global['t']" is a function, then TranslateParams will be
 * an array of the parameter types of that function. Otherwise, it will be
 * "never".
 */
export type TranslateParams<Global extends { t: unknown }> =
  Global['t'] extends (...params: infer Params) => unknown ? Params : never

/** Tail Returns all elements of an array except for the first element. */
export type Tail<A extends unknown[]> = A extends [unknown, ...infer Values]
  ? Values
  : []
