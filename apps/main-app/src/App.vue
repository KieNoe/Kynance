<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '@/infrastructure/locales/useLocale'
import { useSettingStore } from '@/stores'

const store = useSettingStore()

const mode = computed(() => {
  return store.mode
})
const { getComponentsLocale, locale } = useLocale()
</script>

<template>
  <div>
    <t-config-provider :global-config="getComponentsLocale">
      <router-view :key="locale" :class="[mode]" />
    </t-config-provider>
  </div>
</template>

<style scoped>
div {
  height: 100vh;
  width: 100vw;
}
</style>
