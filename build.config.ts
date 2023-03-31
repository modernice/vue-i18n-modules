import { defineBuildConfig } from 'unbuild'
import pkg from './package.json'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/vite/index', name: 'vite/index' },
    { input: 'src/nuxt/index', name: 'nuxt/index' },
  ],
  rollup: {
    emitCJS: true,
  },
  externals: [
    '#app',
    ...Object.keys((pkg as any).dependencies || {}),
    ...Object.keys((pkg as any).peerDependencies || {}),
  ],
  clean: process.env.BUILD_WATCH ? false : true,
})
