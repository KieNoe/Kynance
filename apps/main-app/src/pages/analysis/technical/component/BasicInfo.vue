<template>
  <t-card class="basicInfo" style="margin-bottom: 2vh">
    <div class="buttons">
      <t-tooltip :content="t('pages.analysis.technical.basicInfo.layout')">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="module" /></template> </t-button></t-tooltip
      ><t-tooltip :content="t('pages.analysis.technical.basicInfo.analysis')">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="analytics" /></template> </t-button></t-tooltip
      ><t-tooltip :content="t('pages.analysis.technical.basicInfo.star')">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="star" /></template> </t-button></t-tooltip
      ><t-tooltip :content="t('pages.analysis.technical.basicInfo.PDF')">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="download" /></template> </t-button
      ></t-tooltip>
    </div>
    <div class="contents" v-for="i in companyInfo.basicInfo" :key="i.title">
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
