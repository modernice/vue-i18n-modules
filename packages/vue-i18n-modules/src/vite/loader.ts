import type {
  ModuleLoader,
  ModuleLoaderContext,
  ModuleName,
  ModuleT,
} from '../types'

/**
 * Files returned by Vite's `import.meta.glob` with support for dynamic and static imports.
 */
export type GlobFiles =
  | Record<string, () => Promise<unknown>>
  | Record<string, Record<string, unknown>>

function normalizeGlobPath(path: string) {
  return path.replace(/\\/g, '/')
}

function resolveGlobFile(files: GlobFiles, path: string, fallbackPath = path) {
  const normalizedPath = normalizeGlobPath(path)
  const exact = files[normalizedPath]

  if (exact) {
    return exact
  }

  const suffix = `/${normalizeGlobPath(fallbackPath).replace(/^\/+/, '')}`
  const matches = Object.entries(files).filter(([key]) =>
    normalizeGlobPath(key).endsWith(suffix),
  )

  return matches.length === 1 ? matches[0]![1] : undefined
}

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
  },
): ModuleLoader {
  return async <Name extends ModuleName, Module = ModuleT<Name>>(
    ctx: ModuleLoaderContext,
  ): Promise<Module> => {
    const prefix = (options?.prefix ?? '').replace(/\/+$/, '')
    const path = prefix ? `${prefix}/${ctx.path.replace(/^\/+/, '')}` : ctx.path
    const loader = resolveGlobFile(files, path, ctx.path)

    if (!loader) {
      throw new Error(
        `[vue-i18n-modules] Message module "${ctx.module}" not found at path "${path}".`,
      )
    }

    if (typeof loader === 'function') {
      const file = (await Promise.resolve(loader())) as
        | Module
        | { default: Module }
      return typeof file === 'object' && 'default' in file!
        ? file.default
        : file
    }

    const file = loader as Module | { default: Module }
    return typeof file === 'object' && 'default' in file! ? file.default : file
  }
}
