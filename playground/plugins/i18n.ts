import { defineNuxtPlugin } from '#imports'
import { English, languages } from '../config/i18n.js'
import { createI18n } from 'vue-i18n'
import {
  createGlobLoader,
  createExtension,
} from '@modernice/vue-i18n-modules/nuxt'
import type foo from '../dictionary/foo/index.js'
import type bar from '../dictionary/bar/index.js'

declare module '@modernice/vue-i18n-modules' {
  interface DefineModules {
    foo: typeof foo
    bar: typeof bar
  }
}

function createLoader() {
  return createGlobLoader(import.meta.glob('../dictionary/**/*.json'), {
    prefix: '../dictionary/',
  })
}

export default defineNuxtPlugin((app) => {
  const { vueApp } = app

  const i18n = createI18n({
    locale: English,
    fallbackLocale: English,
    availableLocales: languages,
    legacy: false,
  })

  vueApp.use(i18n)

  createExtension({
    i18n: i18n.global,
    loader: createLoader(),
    initial: ['foo'],
  })(app)
})
