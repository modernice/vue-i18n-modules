import { languages } from './config/i18n'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  i18n: {
    locales: languages.slice(),
    defaultLocale: 'en',
  },

  i18nModules: {
    // Use the external dictionary from the workspace package
    dictionary: '../../external-dictionary/dictionary',
    initial: ['foo'],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  compatibilityDate: '2025-09-11',
})
