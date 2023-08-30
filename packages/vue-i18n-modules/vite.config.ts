import { defineConfig } from 'vite'
import { readPackageJSON } from 'pkg-types'
import dts from 'vite-plugin-dts'

export default defineConfig(async () => {
  const pkg = await readPackageJSON()
  const deps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]

  return {
    plugins: [
      dts({
        beforeWriteFile(filePath, content) {
          if (filePath.endsWith('dist/extension.d.ts')) {
            return {
              filePath,
              content: content
                .replaceAll(
                  '<Name extends string>(module: Name, key: string',
                  '<Name extends ModuleName>(module: Name, key: ConcatKeys<ModuleT<Name>>',
                )
                .replaceAll(
                  '<Name extends string, Key extends string>',
                  '<Name extends ModuleName, Key extends ConcatKeys<ModuleT<Name>>>',
                ),
            }
          }

          if (filePath.endsWith('dist/composables.d.ts')) {
            return {
              filePath,
              content: content.replaceAll(
                '<Key extends string>',
                '<Key extends ConcatKeys<ModuleT<Name>>>',
              ),
            }
          }
        },
      }),
    ],

    build: {
      lib: {
        entry: {
          index: './src/index.ts',
          vite: './src/vite/index.ts',
        },
        fileName: (format, name) => {
          const path = name === 'index' ? 'index' : `${name}/index`
          return format === 'es' ? `${path}.mjs` : `${path}.${format}`
        },
        formats: ['es', 'cjs'],
      },

      rollupOptions: { external: deps },
    },
  }
})
