<script setup lang="ts">
import { useMessages } from '@modernice/vue-i18n-modules'

const { messageNamespace: bazNamespace } = useMessages('baz', { load: false })
</script>

<template>
  <div>
    <i18n-t :keypath="bazNamespace('hello')">
      <template #name>Bob</template>
    </i18n-t>
  </div>
</template>
