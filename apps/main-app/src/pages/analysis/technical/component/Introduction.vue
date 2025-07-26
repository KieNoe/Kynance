<template>
  <t-card class="introduction">
    <header>{{ t('pages.analysis.technical.introduction.title') }}</header>
    <div class="contents" v-for="i in companyInfo.introduction" :key="i.title">
      <t-divider style="margin: var(--td-comp-margin-m) 0"></t-divider>
      <div class="content">
        <t-tooltip :content="i.detail">
          <p>{{ i.title }}</p></t-tooltip
        >
        <p class="value">{{ i.value }}</p>
      </div>
    </div>
  </t-card>
</template>
<script setup lang="ts">
import { t } from '@/infrastructure/locales'

defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})
</script>
<style scoped lang="less">
@import '../index.less';
</style>
