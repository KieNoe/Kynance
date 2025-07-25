<template>
  <div id="chartContainer" class="card">
    <header>
      <t-dropdown
        v-for="(item, key) in OPTIONS.dropdownItems"
        :key="key"
        class="dropdown"
        :options="OPTIONS[key]"
        trigger="click"
        :disabled="disabled"
        :min-column-width="65"
        @click="
          async (data) => {
            disabled = true
            MessagePlugin.success('已选择' + data.content + '技术曲线')
            ;(status as Record<string, any>)[key as string].value = data.content
            switch (key) {
              case 'date':
                try {
                  status[key].loading = true
                  if (
                    !stockData[data.value as string] ||
                    Object.keys(stockData[data.value as string]).length === 0
                  ) {
                    stockData[data.value as string] = await getDayData('0700', data.value)
                    stockData['default'] = stockData[data.value as string]
                  }
                  changeCharts(
                    [mainChart, trendingChart, shockChart],
                    [
                      getStockChartOptions(stockData['default'], props.companyInfo.currency),
                      getTrendingChartOptions(stockData['default'], status['trending'].value),
                      getShockChartOptions(stockData['default'], status['shock'].value),
                    ],
                  )
                  status[key].loading = false
                } catch (err) {
                  MessagePlugin.error('获取数据失败')
                  console.log(err)
                  status[key].loading = false
                }
                break
              case 'trending':
                status[key].loading = true
                try {
                  changeCharts(
                    [mainChart, trendingChart, shockChart],
                    [
                      getStockChartOptions(stockData['default'], props.companyInfo.currency),
                      getTrendingChartOptions(stockData['default'], status['trending'].value),
                      getShockChartOptions(stockData['default'], status['shock'].value),
                    ],
                  )
                  status[key].loading = false
                } catch {
                  MessagePlugin.error('获取数据失败')
                  status[key].loading = false
                }
                break
              case 'shock':
                status[key].loading = true
                try {
                  changeCharts(
                    [mainChart, trendingChart, shockChart],
                    [
                      getStockChartOptions(stockData['default'], props.companyInfo.currency),
                      getTrendingChartOptions(stockData['default'], status['trending'].value),
                      getShockChartOptions(stockData['default'], status['shock'].value),
                    ],
                  )
                  status[key].loading = false
                } catch {
                  MessagePlugin.error('获取数据失败')
                  status[key].loading = false
                }
                break
            }
            disabled = false
          }
        "
      >
        <t-space>
          <t-button variant="text" :disabled="status[key].loading">
            {{ status[key].value }}
            <template #suffix> <t-icon name="chevron-down" size="16" /></template>
          </t-button>
        </t-space>
      </t-dropdown>
      <t-select
        v-model="stock"
        :options="stockOptions"
        placeholder="请选择股票"
        style="max-width: 25vw; display: inline-block"
      >
        <template #panelTopContent>
          <div style="padding: 6px 6px 0 6px">
            <t-input
              v-model="search"
              placeholder="搜索(支持中英文名称，地区，代码)"
              @change="onSearch"
            />
          </div>
        </template>
      </t-select>
    </header>
    <div id="mainChart" style="width: 56.7vw; height: 50vh"></div>
    <div id="trendingChart" style="width: 56.7vw; height: 50vh"></div>
    <div id="shockChart" style="width: 56.7vw; height: 50vh"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, shallowRef } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import {
  getStockChartOptions,
  changeCharts,
  getTrendingChartOptions,
  getShockChartOptions,
} from '@kynance/chart-core'

import { initCharts } from '@/infrastructure/hook'
import { getDayData } from '@/services/client'

import { OPTIONS } from '../index'
const props = defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})
let mainChart
let trendingChart
let shockChart
const disabled = shallowRef(false)
const search = shallowRef('')
const stock = shallowRef('腾讯控股(Tencent)')

const status = reactive({
  date: { value: '1天', loading: false },
  trending: { value: 'MA(5)', loading: false },
  shock: { value: 'RSI', loading: false },
})

const stockData = shallowRef({
  default: {},
  '1d': {},
  '10d': {},
  '1m': {},
  '6m': {},
  '1y': {},
})

const stockOptions = shallowRef(OPTIONS.stock)
const onSearch = () => {
  stockOptions.value = OPTIONS.stock.filter((item) => item.title.indexOf(search.value) !== -1)
}
onMounted(async () => {
  stockData.value['1d'] = await getDayData('0700', '1d')
  stockData.value['default'] = stockData.value['1d']
  const arr = await initCharts(
    ['mainChart', 'trendingChart', 'shockChart'],
    [mainChart, trendingChart, shockChart],
    [
      getStockChartOptions(stockData.value['1d'], props.companyInfo.currency),
      getTrendingChartOptions(stockData.value['1d'], 'MA(5)'),
      getShockChartOptions(stockData.value['1d'], 'RSI'),
    ],
    onUnmounted,
  )
  mainChart = arr[0]
  trendingChart = arr[1]
  shockChart = arr[2]
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
