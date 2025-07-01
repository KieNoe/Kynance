<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '@/infrastructure/locales/useLocale'
import { useSettingStore } from '@/stores'

const store = useSettingStore()

const mode = computed(() => {
  return store.displayMode
})
const { getComponentsLocale, locale } = useLocale()
</script>

<template>
  <t-config-provider :global-config="getComponentsLocale">
    <router-view :key="locale" :class="[mode]" />
  </t-config-provider>
</template>

<style scoped></style>
