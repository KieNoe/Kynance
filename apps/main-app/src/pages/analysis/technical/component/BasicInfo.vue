<template>
  <t-card class="basicInfo" style="margin-bottom: 2vh">
    <div class="buttons">
      <t-tooltip :content="t('pages.analysis.technical.basicInfo.layout')">
        <t-button shape="circle" variant="outline" @click="onLayout">
          <template #icon> <t-icon name="module" /></template> </t-button></t-tooltip
      ><t-tooltip :content="t('pages.analysis.technical.basicInfo.analysis')">
        <t-button shape="circle" variant="outline" @click="onAnalysis">
          <template #icon> <t-icon name="analytics" /></template> </t-button></t-tooltip
      ><t-tooltip :content="t('pages.analysis.technical.basicInfo.star')">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="star" /></template> </t-button></t-tooltip
      ><t-tooltip :content="t('pages.analysis.technical.basicInfo.PDF')">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="download" /></template> </t-button
      ></t-tooltip>
    </div>
    <t-dialog
      :visible="layoutVisible"
      header="请拖拽布局"
      width="40%"
      top="2%"
      :confirm-on-enter="true"
      :on-cancel="onClose"
      :on-esc-keydown="onClose"
      :on-close-btn-click="onClose"
      :on-overlay-click="onClose"
      :on-close="onClose"
      :on-confirm="onConfirm"
    >
      <div>
        <Draggable ref="draggable" />
      </div>
    </t-dialog>
    <t-dialog
      :visible="analysisVisible"
      header="分析报告"
      width="65%"
      top="2%"
      :confirm-on-enter="true"
      :on-cancel="onClose"
      :on-esc-keydown="onClose"
      :on-close-btn-click="onClose"
      :on-overlay-click="onClose"
      :on-close="onClose"
      :on-confirm="onClose"
    >
      <Analysis />
    </t-dialog>
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
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { t } from '@/infrastructure/locales'

import Draggable from './Draggable.vue'
import Analysis from './Analysis.vue'

defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})

const layoutVisible = ref(false)
const analysisVisible = ref(false)
const draggable = ref(null)

const onClose = () => {
  layoutVisible.value = false
  analysisVisible.value = false
}

const onLayout = () => {
  layoutVisible.value = true
}

const onAnalysis = () => {
  analysisVisible.value = true
}

const onConfirm = () => {
  layoutVisible.value = false
  draggable.value?.saveSortPlace()
  MessagePlugin.success('保存成功')
}
</script>
<style scoped lang="less">
@import '../index.less';
</style>
