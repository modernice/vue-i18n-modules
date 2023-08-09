export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },

  i18nModules: {
    initial: ['foo'],
  },
})
