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
        @click="(data) => handleDropdownClick(key, data)"
      >
        <t-space>
          <t-button variant="text" :disabled="dropdownStatus[key].loading">
            {{ dropdownStatus[key].value }}
          </t-button>
        </t-space>
      </t-dropdown>

      <!-- 股票选择器 -->
      <t-select
        v-model="stock"
        :options="stockOptions"
        :placeholder="t('pages.analysis.technical.chart.select')"
        style="max-width: 22.5vw; display: inline-block"
        @change="
          (data) => {
            updateCharts(true)
            visible = data != '07000.HK'
            watchListStore.setCurrentStockCode(stock)
          }
        "
      >
        <template #panelTopContent>
          <div style="padding: 0.375em 0.375em 0 0.375em">
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
        width="60%"
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
            <img src="@/assets/assets-maodie.webp" />
          </div>
        </t-space>
      </t-dialog>
    </header>

    <!-- 图表容器 -->
    <div class="charts-wrapper" v-for="chart in sortedCharts" :key="chart">
      <div class="chart-container" :id="chart" :ref="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, shallowRef } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { initCharts } from '@/infrastructure/hook'
import { debounce } from '@/infrastructure/utils'
import { getDayData } from '@/services/client'
import { useStockDataStore, useWatchListStore } from '@/stores'
import { t } from '@/infrastructure/locales'
import { container } from '@/infrastructure/container/container'
import { TYPES } from '@kynance/types'
import type { IChartService } from '@kynance/types'

import { OPTIONS } from '../index'

const stockDataStore = useStockDataStore()
const watchListStore = useWatchListStore()

const visible = ref(false)
const disabled = ref(false)
const search = ref('')
const stock = shallowRef('07000.HK')

const dropdownStatus = reactive({
  date: { value: t('pages.analysis.technical.oneMonth'), loading: false },
  trending: { value: 'MA(5)', loading: false },
  shock: { value: 'RSI', loading: false },
  init: () => {
    dropdownStatus['date'].value = t('pages.analysis.technical.oneMonth')
    dropdownStatus['trending'].value = 'MA(5)'
    dropdownStatus['shock'].value = 'RSI'
  },
})

const stockOptions = shallowRef(OPTIONS.stock)
const sortedCharts = computed(() => {
  return stockDataStore.sortPlace.map((index) => OPTIONS.CHARTS[index - 1])
})

let chartService: IChartService
const mainChart = ref(null)
const trendingChart = ref(null)
const shockChart = ref(null)
const charts = [{ ref: mainChart }, { ref: trendingChart }, { ref: shockChart }]

const updateCharts = async (isReRender = false) => {
  if (isReRender) {
    dropdownStatus.init()
    stockDataStore.initStockData(getDayData)
  }
  chartService.changeCharts(
    charts,
    chartService.getOptions(stockDataStore.stockData.default, [
      dropdownStatus.trending.value,
      dropdownStatus.shock.value,
    ]),
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
      await stockDataStore.updateStockData(data.value, getDayData)
    }
    updateCharts()
    dropdownStatus[key].loading = false
  } catch (err) {
    MessagePlugin.error(t('pages.analysis.technical.chart.dataError'), err)
    dropdownStatus[key].loading = false
  } finally {
    disabled.value = false
  }
}

onMounted(() => {
  chartService = container.get<IChartService>(TYPES.IChartService)
  const tryInitialize = async (attempt = 0) => {
    const maxAttempts = 10 // 最大尝试次数
    const retryDelay = 300 // 重试间隔（ms）

    // 尝试通过ID获取DOM元素
    const chartElements = OPTIONS.CHARTS.map((chartId) => document.getElementById(chartId))
    const allElementsFound = chartElements.every((el) => el !== null)

    if (allElementsFound) {
      chartElements.forEach((el, index) => {
        charts[index].ref.value = el
      })

      try {
        await stockDataStore.initStockData(getDayData)
        await initCharts(
          charts,
          chartService.getInitialOptions(stockDataStore.stockData['default']),
          onUnmounted,
        )
      } catch (err) {
        handleError(err)
      }
    } else if (attempt < maxAttempts) {
      setTimeout(() => tryInitialize(attempt + 1), retryDelay)
    }
  }

  // Start the initialization process
  tryInitialize()
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
