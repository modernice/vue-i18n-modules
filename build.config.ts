import { defineBuildConfig } from 'unbuild'

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
  externals: ['nuxt', 'nuxt/app'],
  clean: process.env.BUILD_WATCH ? false : true,
})
