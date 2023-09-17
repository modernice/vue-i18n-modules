import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: false,
  declaration: true,
  entries: [{ input: './src/middleware.ts', name: 'middleware' }],
  rollup: { emitCJS: true },
})
