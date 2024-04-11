<script setup lang="ts">
import { useMessages } from '@modernice/vue-i18n-modules'
import { computed } from 'vue'

const { t } = useMessages('object-array', { load: true })

const name = computed(() => t('elements.0.name'))
</script>

<template>
  <div>Name: {{ name }}</div>
</template>
