<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useLocale } from '@/infrastructure/locales/useLocale'
import FullBack from '@/pages/fullBack/base/index.vue'
import { useSettingStore } from '@/stores'

const store = useSettingStore()

const mode = computed(() => {
  return store.mode
})
const { getComponentsLocale, locale } = useLocale()

const route = useRoute()
const backToTop = ref()
const isAppActive = ref(true)

watch(
  () => route.path,
  () => {
    backToTop.value.focus()
  },
)

const recoverApp = () => {
  isAppActive.value = true
}

const globalErrorHandler = (err) => {
  console.error('Fatal error', err)
  isAppActive.value = false
  const timeId = setTimeout(recoverApp, 3000)
  clearTimeout(timeId)
}

onMounted(() => {
  window.addEventListener('error', globalErrorHandler)
  window.addEventListener('unhandledrejection', globalErrorHandler)
})

onUnmounted(() => {
  window.removeEventListener('error', globalErrorHandler)
  window.removeEventListener('unhandledrejection', globalErrorHandler)
})
</script>

<template>
  <div v-if="isAppActive">
    <t-config-provider :global-config="getComponentsLocale">
      <router-view :key="locale" :class="[mode]" />
      <span ref="backToTop" tabindex="-1" />
      <ul class="skip-links">
        <li>
          <t-link href="/help/base" class="skip-link">Skip to main content</t-link>
        </li>
      </ul>
    </t-config-provider>
  </div>
  <div v-else>
    <full-back />
  </div>
</template>

<style scoped>
div {
  height: 100vh;
  width: 100vw;
}
.skip-links {
  list-style: none;
  margin: 0;
}
.skip-link {
  white-space: nowrap;
  margin: 0;
  top: 0;
  position: absolute;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: var(--td-bg-color-container);
  border: 1px solid var(--td-bg-color-container);
}
</style>
