<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useLocale } from '@/infrastructure/locales/useLocale'
import { useSettingStore } from '@/stores'

const store = useSettingStore()

const mode = computed(() => {
  return store.mode
})
const { getComponentsLocale, locale } = useLocale()

const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => {
    backToTop.value.focus()
  },
)
</script>

<template>
  <div>
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
