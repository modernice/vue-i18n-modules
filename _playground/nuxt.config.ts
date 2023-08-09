import { URL, fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  typescript: {
    shim: false,
  },

  vite: {
    resolve: {
      alias:
        process.env.NODE_ENV === 'development'
          ? [
              {
                find: '@modernice/vue-i18n-modules',
                replacement: fileURLToPath(new URL('../src', import.meta.url)),
              },
            ]
          : undefined,
    },
  },
})
