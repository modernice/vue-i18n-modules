<script lang="ts" setup>
import { useExtension, useMessages } from '@modernice/vue-i18n-modules'
import { useI18n } from 'vue-i18n'
import { languages } from '@/config/i18n'

definePageMeta({
  middleware: ['messages'],
  messages: ['bar'],
})

const { loadModule } = useExtension()
const { setLocaleMessage } = useI18n()

const { translate: translateFoo } = useMessages('foo')
const { translate: translateBar } = useMessages('bar')

function reset() {
  for (const language of languages) {
    setLocaleMessage(language, {})
  }
}
</script>

<template>
  <div>
    <div :style="{ display: 'flex', gap: '0.25rem' }">
      <button @click="loadModule('foo')">Load "foo" messages</button>
      <button @click="loadModule('bar')">Load "bar" messages</button>
      <button @click="reset">Clear messages</button>
    </div>

    <ul>
      <li>
        {{ translateFoo('foo-a') }}
      </li>

      <li>
        {{ translateFoo('foo-b') }}
      </li>

      <li>
        {{ translateFoo('foo-c') }}
      </li>

      <li>
        {{ translateFoo('foo-d') }}
      </li>
    </ul>

    <ul>
      <li>
        {{ translateBar('bar-a') }}
      </li>

      <li>
        {{ translateBar('bar-b') }}
      </li>

      <li>
        {{ translateBar('bar-c') }}
      </li>

      <li>
        {{ translateBar('bar-d') }}
      </li>
    </ul>
  </div>
</template>
