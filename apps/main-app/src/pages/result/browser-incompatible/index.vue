<template>
  <div class="result-slot-container">
    <result
      :title="t('pages.result.browserIncompatible.title')"
      type="ie"
      :tip="t('pages.result.browserIncompatible.subtitle')"
    >
      <t-button class="result-button" @click="() => $router.push('/')">{{
        t('pages.result.browserIncompatible.back')
      }}</t-button>
    </result>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ResultBrowserIncompatible',
}
</script>
<script setup lang="ts">
import Result from '@/components/result/index.vue'
import { t } from '@/infrastructure/locales'
</script>

<style lang="less" scoped>
.result-slot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
  margin-top: 20vh;
  max-height: 240px;
}
</style>
