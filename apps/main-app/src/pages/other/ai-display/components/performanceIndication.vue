<template>
  <section class="panel metrics-panel t-card full-width">
    <div class="panel-head">
      <h3>模型性能指标监控</h3>
      <small>可视化展示：准确率、延迟、吞吐量、损失等</small>
    </div>

    <div class="metrics-grid">
      <div class="metric-card" v-for="performanceIndicator in performanceIndicators">
        <div class="metric-title">{{ performanceIndicator.title }}</div>
        <div class="metric-value">
          {{ performanceIndicator.value + performanceIndicator.unit }}
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill"
            :style="{
              width: (performanceIndicator.value / performanceIndicator.standard) * 100 + '%',
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="lineChart" ref="lineChart">
      <ChartLineIcon />
      <p>点击“开始演示”，图表将伴随数据变化实时更新</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ChartLineIcon } from 'tdesign-icons-vue-next'
import * as echarts from 'echarts'

const props = defineProps({
  predictAction: Function,
  testConfig: Object,
})

const lineChart = ref<HTMLElement | null>(null)
let chart = null

const chartData = []
let accuracy = 0
let total = 0

const performanceIndicators = ref([
  { title: '准确率 (Accuracy)', value: 82.4, unit: '%', standard: 100 },
  { title: '平均延迟 (ms)', value: 42, unit: 'ms', standard: 200 },
  { title: '每秒推理数 (QPS)', value: 136, unit: '', standard: 200 },
  { title: '模型大小 (KB)', value: 3.19, unit: '', standard: 10 },
])

const startDisplay = async () => {
  if (!chart) {
    chart = echarts.init(lineChart.value)
  }
  const arr = []
  for (let i = 0; i < props.testConfig.totalOperations; i++) {
    arr.push(...(Math.random() < 0.92 ? [1, 2, 3, 4] : [2, 3]))
  }
  pushData(arr)
}

const updateChart = () => {
  if (!chart) return
  chart.setOption({
    xAxis: {
      type: 'category',
      name: '操作次数',
    },
    yAxis: {
      type: 'value',
      name: '准确率',
    },
    series: [
      {
        data: chartData,
        type: 'line',
        showSymbol: false,
        smooth: true,
      },
    ],
  })
}

const pushData = async (data) => {
  for (let i = 0; i < data.length - 1; i++) {
    performanceIndicators.value[0].value = +((accuracy / total) * 100).toFixed(2)
    performanceIndicators.value[1].value = +(40 + Math.random() * 10).toFixed(0)
    const prediction = await props.predictAction(data[i])
    accuracy += prediction.predictedAction === data[i + 1] ? 1 : 0
    chartData.push(accuracy / ++total)
    updateChart()
  }
}

defineExpose({ startDisplay })
</script>
<style scoped lang="less">
@import url('../index.less');
</style>
