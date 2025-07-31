<template>
  <div v-for="chart in charts">
    <div class="chart" :id="chart" :ref="chart"></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, ref } from 'vue'
const charts = ['main', 'trending', 'shock']
const main = ref(null)
const trending = ref(null)
const shock = ref(null)
onMounted(() => {
  nextTick(() => {
    if (main.value) {
      console.log('main', main.value)
      const myChart = echarts.init(main.value[0])
      console.log('main chart', myChart)
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        legend: {
          data: ['销量'],
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      })
    }
  })
})
</script>
<style scoped>
.chart {
  width: 800px;
  height: 500px;
}
</style>
