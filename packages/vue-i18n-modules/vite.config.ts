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
    plugins: [dts()],

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
