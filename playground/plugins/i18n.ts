import { createI18n } from 'vue-i18n'
import {
  createGlobLoader,
  createNuxtPlugin,
} from '@modernice/vue-i18n-modules/nuxt'
import { createExtension } from '@modernice/vue-i18n-modules'
import type { Pinia } from 'pinia'
import { English, languages } from '../config/i18n'
import type foo from '../dictionary/foo/index'
import type bar from '../dictionary/bar/index'
import { defineNuxtPlugin } from '#imports'

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

  const pinia = usePinia() as Pinia

  const i18n = createI18n({
    locale: English,
    fallbackLocale: English,
    availableLocales: languages,
    legacy: false,
  })

  vueApp.use(i18n)

  const extension = createExtension({
    pinia,
    i18n: i18n.global,
    loader: createLoader(),
    debug: true,
  })

  createNuxtPlugin(extension, {
    initial: ['foo'],
  })(app)
})
