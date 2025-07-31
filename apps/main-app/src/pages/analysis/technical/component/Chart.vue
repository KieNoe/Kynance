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
            <img src="@/assets/assets-maodie.jpg" />
          </div>
        </t-space>
      </t-dialog>
    </header>

    <!-- 图表容器 -->
    <div class="charts-wrapper" v-for="chart in sortedCharts">
      <div class="chart-container" :id="chart" :ref="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { changeCharts, getInitialOptions, getOptions } from '@kynance/chart-core'

import { initCharts } from '@/infrastructure/hook'
import { debounce } from '@/infrastructure/utils'
import { getDayData } from '@/services/client'
import { useStockDataStore } from '@/stores'
import { t } from '@/infrastructure/locales'

import { OPTIONS } from '../index'

const stockDataStore = useStockDataStore()

const visible = ref(false)
const disabled = ref(false)
const search = ref('')
const stock = shallowRef('腾讯控股(Tencent)')

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

const mainChart = ref(null)
const trendingChart = ref(null)
const shockChart = ref(null)
const charts = [{ ref: mainChart }, { ref: trendingChart }, { ref: shockChart }]

const updateCharts = async (isReRender = false) => {
  if (isReRender) {
    dropdownStatus.init()
    stockDataStore.initStockData(getDayData)
  }
  changeCharts(
    charts,
    getOptions(stockDataStore.stockData.default, [
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
    MessagePlugin.error(t('pages.analysis.technical.chart.dataError'))
    dropdownStatus[key].loading = false
  } finally {
    disabled.value = false
  }
}

onMounted(() => {
  nextTick(async () => {
    if (mainChart.value) {
      try {
        await stockDataStore.initStockData(getDayData)
        await initCharts(
          charts,
          getInitialOptions(stockDataStore.stockData['default']),
          onUnmounted,
        )
      } catch (err) {
        handleError(err)
      }
    }
  })
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
