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
  PrefixedKeys = `${Prefix}${keyof T & string}`,
  NewPrefix = `${PrefixedKeys & string}${Separator}`,
  ChildKeys = keyof T,
> = ChildKeys extends Record<string, unknown>
  ? PrefixedKeys | ConcatKeys<ChildKeys, Separator, NewPrefix & string>
  : PrefixedKeys

export type TranslateParams<Global extends { t: unknown }> =
  Global['t'] extends (...params: infer Params) => unknown ? Params : never

export type Tail<A extends unknown[]> = A extends [unknown, ...infer Values]
  ? Values
  : []
