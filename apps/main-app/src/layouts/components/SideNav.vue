<template>
  <div>
    <t-menu :value="active" class="side-nav">
      <menu-content />
      <template #operations>
        <span class="version-container"> Kynance {{ packageVersion }} </span>
      </template>
    </t-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { getActive } from '@/router'

const packageVersion = import.meta.env.VITE_PKG_VERSION
import MenuContent from './MenuContent.vue'

const active = computed(() => getActive())
</script>

<style lang="less" scoped>
.version-container {
  color: var(--td-text-color-secondary);
  padding-left: 0.6vw;
}
.side-nav {
  margin-right: 3.9vw;
  height: 100%;
}
</style>
