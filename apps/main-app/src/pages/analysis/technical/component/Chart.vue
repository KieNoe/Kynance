<template>
  <div id="chartContainer" class="card">
    <header>
      <!-- 下拉菜单组 -->
      <t-dropdown
        v-for="(item, key) in OPTIONS.dropdownItems"
        :key="key"
        class="dropdown"
        :options="OPTIONS[key]"
        trigger="click"
        :disabled="disabled"
        :min-column-width="65"
        @click="(data) => handleDropdownClick(key, data)"
      >
        <t-space>
          <t-button variant="text" :disabled="dropdownStatus[key].loading">
            {{ dropdownStatus[key].value }}
            <template #suffix>
              <t-icon name="chevron-down" size="16" />
            </template>
          </t-button>
        </t-space>
      </t-dropdown>

      <!-- 股票选择器 -->
      <t-select
        v-model="stock"
        :options="stockOptions"
        :placeholder="t('pages.analysis.technical.chart.select')"
        style="max-width: 25vw; display: inline-block"
        @change="
          (data) => {
            updateCharts(true)
            visible = data != '0700'
          }
        "
      >
        <template #panelTopContent>
          <div style="padding: 6px 6px 0 6px">
            <t-input
              v-model="search"
              :placeholder="t('pages.analysis.technical.chart.search')"
              @change="onSearch"
            />
          </div>
        </template>
      </t-select>
      <t-dialog
        v-model:visible="visible"
        header="请输入文本"
        width="50%"
        top="3%"
        :confirm-on-enter="true"
        :on-cancel="onClose"
        :on-esc-keydown="onClose"
        :on-close-btn-click="onClose"
        :on-overlay-click="onClose"
        :on-close="onClose"
        :on-confirm="onClose"
      >
        <t-space direction="vertical" style="width: 100%">
          <div>
            <p>很抱歉，先生，虽然让您遇到了数据单一的问题</p>
            <p>但KieNoe保证，会提供除帮助以外的一切支持</p>
            <img src="@/assets/assets-maodie.jpg" alt="" />
          </div>
        </t-space>
      </t-dialog>
    </header>

    <!-- 图表容器 -->
    <div id="mainChart" class="chart-container"></div>
    <div id="trendingChart" class="chart-container"></div>
    <div id="shockChart" class="chart-container"></div>
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
import { debounce } from '@/infrastructure/utils'
import { getDayData } from '@/services/client'
import { t } from '@/infrastructure/locales'

import { OPTIONS } from '../index'

const props = defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})

const visible = shallowRef(false)
const disabled = shallowRef(false)
const search = shallowRef('')
const stock = shallowRef('腾讯控股(Tencent)')

const dropdownStatus = reactive({
  date: { value: t('pages.analysis.technical.oneMonth'), loading: false },
  trending: { value: 'MA(5)', loading: false },
  shock: { value: 'RSI', loading: false },
})

const stockData = reactive({
  default: {},
  '1d': {},
  '10d': {},
  '1m': {},
  '6m': {},
  '1y': {},
})

const stockOptions = shallowRef(OPTIONS.stock)

let mainChart
let trendingChart
let shockChart

const updateCharts = async (isReRender = false) => {
  if (isReRender) {
    dropdownStatus['date'].value = t('pages.analysis.technical.oneMonth')
    dropdownStatus['trending'].value = 'MA(5)'
    dropdownStatus['shock'].value = 'RSI'
    stockData['1m'] = await getDayData('0700', '1m')
    stockData['10d'] = stockData['1d'] = stockData['6m'] = stockData['1y'] = {}
    stockData['default'] = stockData['1m']
  }
  changeCharts(
    [mainChart, trendingChart, shockChart],
    [
      getStockChartOptions(stockData['default'], props.companyInfo.currency),
      getTrendingChartOptions(stockData['default'], dropdownStatus.trending.value),
      getShockChartOptions(stockData['default'], dropdownStatus.shock.value),
    ],
  )
}

const onClose = () => {
  visible.value = false
}

const onSearch = debounce(() => {
  stockOptions.value = OPTIONS.stock.filter((item) => item.title.indexOf(search.value) !== -1)
}, 300)

const handleError = (err) => {
  MessagePlugin.error(t('pages.analysis.technical.chart.error'))
  console.error(err)
}

const handleDropdownClick = async (key, data) => {
  disabled.value = true
  MessagePlugin.success(
    t('pages.analysis.technical.chart.selected') +
      `${data.content}` +
      t('pages.analysis.technical.chart.technologyCurve'),
  )
  dropdownStatus[key].value = data.content

  try {
    dropdownStatus[key].loading = true
    if (key === 'date') {
      if (!stockData[data.value] || Object.keys(stockData[data.value]).length === 0) {
        stockData[data.value] = await getDayData('0700', data.value)
        stockData.default = stockData[data.value]
      }
    }
    updateCharts()
    dropdownStatus[key].loading = false
  } catch (err) {
    MessagePlugin.error(t('pages.analysis.technical.chart.dataError'))
    console.error(err)
    dropdownStatus[key].loading = false
  } finally {
    disabled.value = false
  }
}

onMounted(async () => {
  try {
    stockData['1m'] = await getDayData('0700', '1m')
    stockData['default'] = stockData['1m']
    const arr = await initCharts(
      ['mainChart', 'trendingChart', 'shockChart'],
      [mainChart, trendingChart, shockChart],
      [
        getStockChartOptions(stockData['default'], props.companyInfo.currency),
        getTrendingChartOptions(stockData['default'], 'MA(5)'),
        getShockChartOptions(stockData['default'], 'RSI'),
      ],
      onUnmounted,
    )
    mainChart = arr[0]
    trendingChart = arr[1]
    shockChart = arr[2]
  } catch (err) {
    handleError(err)
  }
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
