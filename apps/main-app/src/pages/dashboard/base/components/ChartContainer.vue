<template>
  <t-card :title="t('pages.dashboard.market')" :bordered="false" class="market-overview-card">
    <div ref="chartContainer" class="chart-container"></div>
  </t-card>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

import { t } from '@/infrastructure/locales'

import { OPTIONS } from '../constant'
const chartContainer = ref<HTMLElement | null>(null)
let chart = null
const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    chart.setOption(OPTIONS)
  }
}
const handleResize = () => {
  chart?.resize()
}
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})
</script>
<style scoped lang="less">
@import url('../index.less');
</style>
