<template>
  <div class="multi-chart-grid">
    <t-card class="sub-chart" :bordered="false">
      <template #header>
        <div class="sub-chart-header"><span>实时价格</span></div>
      </template>
      <div class="sub-chart-content" ref="chart1"></div>
    </t-card>

    <t-card class="sub-chart" :bordered="false">
      <template #header>
        <div class="sub-chart-header"><span>成交量</span></div>
      </template>
      <div class="sub-chart-content" ref="chart2"></div>
    </t-card>

    <t-card class="sub-chart" :bordered="false">
      <template #header>
        <div class="sub-chart-header"><span>技术指标</span></div>
      </template>
      <div class="sub-chart-content" ref="chart3"></div>
    </t-card>

    <t-card class="sub-chart" :bordered="false">
      <template #header>
        <div class="sub-chart-header"><span>资金流向</span></div>
      </template>
      <div class="sub-chart-content" ref="chart4"></div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chart1 = ref<HTMLElement | null>(null)
const chart2 = ref<HTMLElement | null>(null)
const chart3 = ref<HTMLElement | null>(null)
const chart4 = ref<HTMLElement | null>(null)

// ---------- 1️⃣ 随机模拟数据 ----------
function randomArray(len, max = 100) {
  return Array.from({ length: len }, () => Math.round(Math.random() * max))
}

onMounted(() => {
  // 实时价格 → 折线图 (line)
  const lineChart = echarts.init(chart1.value)
  lineChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['09:00', '10:00', '11:00', '12:00', '13:00'] },
    yAxis: { type: 'value' },
    series: [{ name: '价格', type: 'line', smooth: true, data: randomArray(5) }],
    grid: { left: '3%', top: '5%', bottom: '0%', containLabel: true },
  })

  // 成交量 → 柱状图 (bar)
  const barChart = echarts.init(chart2.value)
  barChart.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
    yAxis: { type: 'value' },
    series: [{ name: '量', type: 'bar', data: randomArray(5) }],
    grid: { left: '3%', top: '5%', bottom: '0%', containLabel: true },
  })

  // 技术指标 → 饼图 (pie)
  const pieChart = echarts.init(chart3.value)
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '指标',
        type: 'pie',
        radius: '55%',
        data: [
          { value: randomArray(1)[0], name: 'MACD' },
          { value: randomArray(1)[0], name: 'RSI' },
          { value: randomArray(1)[0], name: 'KDJ' },
          { value: randomArray(1)[0], name: 'BOLL' },
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' },
        },
      },
    ],
  })

  // 资金流向 → 散点图 (scatter)
  const scatterChart = echarts.init(chart4.value)
  scatterChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', name: '时间' },
    yAxis: { type: 'value', name: '流向' },
    series: [
      {
        name: '流向',
        type: 'scatter',
        data: randomArray(10).map((v, i) => [i, v]),
        symbolSize: 12,
        itemStyle: { color: '#61DDAA' },
      },
    ],
    grid: { left: '3%', top: '5%', bottom: '0%', containLabel: true },
  })
})
</script>

<style scoped lang="less">
@import url('../index.less');
.sub-chart-content {
  width: 268px;
  height: 150px;
}
</style>
