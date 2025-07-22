<template>
  <t-card class="basicInfo" style="margin-bottom: 2vh">
    <div class="buttons">
      <t-tooltip content="修改布局">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="module" /></template> </t-button></t-tooltip
      ><t-tooltip content="生成分析报告">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="analytics" /></template> </t-button></t-tooltip
      ><t-tooltip content="收藏">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="star" /></template> </t-button></t-tooltip
      ><t-tooltip content="导出为PDF">
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
