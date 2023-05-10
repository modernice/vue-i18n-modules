import type { DefineModules } from './augment.js'

/**
 * Dictionary is the default type for a message module, if no type is defined
 * in {@link DefineModules}.
 */
export interface Dictionary extends Record<string, string | Dictionary> {}

/**
 * Message module names. If {@link DefineModules} has defined modules,
 * the module name must be a key of {@link DefineModules}. Otherwise any
 * string is allowed.
 */
export type ModuleName = keyof DefineModules extends never
  ? string
  : keyof DefineModules & string

/**
 * Typing for the given named module.
 */
export type ModuleT<Name extends ModuleName> = Name extends keyof DefineModules
  ? DefineModules[Name]
  : Dictionary

/**
 * Loads message modules (e.g. from the filesystem).
 */
export type ModuleLoader = <Name extends ModuleName, Module = ModuleT<Name>>(
  ctx: ModuleLoaderContext
) => Promise<Module>

/**
 * Context that is provided to {@link ModuleLoader} when loading modules.
 */
export interface ModuleLoaderContext {
  /**
   * Name of the module to load.
   */
  module: ModuleName

  /**
   * Path to the module, determined by the currently active locale.
   */
  path: string
}
