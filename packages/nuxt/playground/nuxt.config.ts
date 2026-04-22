import { languages } from './config/i18n'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  i18n: {
    locales: languages.slice().map((lang) => ({
      code: lang,
      language: lang,
    })),
  },

  i18nModules: {
    initial: ['foo'],
    debug: true,
  },

  typescript: {
    strict: true,
    shim: false,
  },

  compatibilityDate: '2025-09-11',
})
