<template>
  <t-card class="basicInfo" style="margin-bottom: 2vh">
    <!-- 使用v-for简化按钮渲染 -->
    <div class="buttons">
      <t-tooltip v-for="(btn, index) in buttons" :key="index" :content="t(btn.tooltip)">
        <t-button
          shape="circle"
          variant="outline"
          @click="handlers[btn.handler]"
          :disabled="btn.handler === 'onDownloadPDF' ? disabled : false"
        >
          <template #icon><t-icon :name="btn.icon" /></template>
        </t-button>
      </t-tooltip>
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
          <p>{{ i.title }}</p>
        </t-tooltip>
        <p class="value">{{ i.value }}</p>
      </div>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import html2pdf from 'html2pdf.js'

import { t } from '@/infrastructure/locales'
import { useWatchListStore } from '@/stores'
import { getWatchList, getSearchList } from '@/services/client'

import Draggable from './Draggable.vue'
import Analysis from './Analysis.vue'

// 定义props
const props = defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
  pageDOM: {
    type: Object,
    required: true,
  },
})

// 提取按钮配置到常量中
const BUTTONS = [
  {
    tooltip: 'pages.analysis.technical.basicInfo.layout',
    icon: 'module',
    handler: 'onLayout',
  },
  {
    tooltip: 'pages.analysis.technical.basicInfo.analysis',
    icon: 'analytics',
    handler: 'onAnalysis',
  },
  {
    tooltip: 'pages.analysis.technical.basicInfo.star',
    icon: 'star',
    handler: 'onStar',
  },
  {
    tooltip: 'pages.analysis.technical.basicInfo.PDF',
    icon: 'download',
    handler: 'onDownloadPDF',
    disabled: true,
  },
]

// PDF导出配置
const PDF_CONFIG = {
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    width: 1500,
    height: 1300,
    logging: false,
    useCORS: true,
  },
  jsPDF: {
    unit: 'px',
    format: [1500, 1300],
    orientation: 'landscape',
  },
}

// 状态管理
const watchListStore = useWatchListStore()
const buttons = BUTTONS
const layoutVisible = ref(false)
const analysisVisible = ref(false)
const draggable = ref(null)
const disabled = ref(true)
const isLoading = ref(false)

// 对话框相关方法
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

// 收藏功能
const onStar = async () => {
  isLoading.value = true
  try {
    const options = await getSearchList()
    if (Array.isArray(options)) {
      options.filter((item) => item.code === watchListStore.currentStockCode)
    }
    const stockInfo = await getWatchList(options)
    if (watchListStore.addStock(stockInfo[0])) {
      MessagePlugin.success('添加成功: ' + stockInfo[0].name)
    } else {
      MessagePlugin.error('已添加该股票')
    }
  } catch (error) {
    MessagePlugin.error('添加失败：' + error.message)
  } finally {
    isLoading.value = false
  }
}

// PDF导出功能
const onDownloadPDF = async () => {
  disabled.value = true
  try {
    const targetEl = props.pageDOM
    if (!targetEl) {
      MessagePlugin.warning(t('pages.analysis.technical.basicInfo.pdfTip'))
      return
    }

    await html2pdf(targetEl, {
      filename: watchListStore.currentStockCode + '.pdf',
      ...PDF_CONFIG,
    })
    MessagePlugin.success('PDF导出成功')
  } catch (error) {
    MessagePlugin.error('PDF导出失败：' + error.message)
  } finally {
    disabled.value = false
  }
}

// 方法映射表
const handlers = {
  onLayout,
  onAnalysis,
  onStar,
  onDownloadPDF,
}

// 生命周期钩子
onMounted(() => {
  disabled.value = false
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
