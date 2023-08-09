export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '../src/module'],

  devtools: { enabled: true },

  i18nModules: {
    initial: ['foo'],
  },
})
