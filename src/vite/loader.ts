import type {
  ModuleLoader,
  ModuleLoaderContext,
  ModuleName,
  ModuleT,
} from '../types.js'

/**
 * Files returned by Vite's `import.meta.glob` with support for dynamic and static imports.
 */
export type GlobFiles =
  | Record<string, () => Promise<unknown>>
  | Record<string, Record<string, unknown>>

/**
 * Creates a {@link ModuleLoader} from `import.meta.glob`, as provided by
 * [Vite](https://vitejs.dev).
 */
export function createGlobLoader(
  files: GlobFiles,
  options?: {
    /**
     * If provided, prepends the prefix to the file path when loading a module.
     */
    prefix?: string
  }
): ModuleLoader {
  return async <Name extends ModuleName, Module = ModuleT<Name>>(
    ctx: ModuleLoaderContext
  ): Promise<Module> => {
    const prefix = (options?.prefix ?? '').replace(/\/+$/, '')
    const path = prefix ? `${prefix}/${ctx.path.replace(/^\/+/, '')}` : ctx.path
    const loader = files[path]

    if (!loader) {
      throw new Error(
        `[vue-i18n-modules] Message module "${ctx.module}" not found at path "${path}".`
      )
    }

    if (typeof loader === 'function') {
      const file = (await Promise.resolve(loader())) as
        | Module
        | { default: Module }
      return 'default' in file ? file.default : file
    }

    const file = loader as Module | { default: Module }
    return 'default' in file ? file.default : file
  }
}
