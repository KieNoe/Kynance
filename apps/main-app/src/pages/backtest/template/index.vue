<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="backtest-container">
    <!-- 页面标题 -->
    <t-card class="header-card">
      <template #header>
        <div class="header-content">
          <h2>{{ t('pages.backtest.template.title') }}</h2>
          <div class="buttons">
            <t-button theme="primary" @click="runBacktest" :loading="isRunning">
              <template #icon><play-icon /></template>
              {{
                isRunning
                  ? t('pages.backtest.template.buttons.running')
                  : t('pages.backtest.template.buttons.runBacktest')
              }}
            </t-button>
            <t-button
              variant="text"
              @click="
                () => {
                  settingVisible = true
                }
              "
              :loading="isRunning"
            >
              <template #icon><SettingIcon /></template>
              {{
                isRunning
                  ? t('pages.backtest.template.buttons.running')
                  : t('pages.backtest.template.buttons.settings')
              }}
            </t-button>
            <t-dialog
              v-model:visible="settingVisible"
              :header="t('pages.backtest.template.dialog.settingsTitle')"
              width="50%"
              top="1%"
              :confirm-on-enter="true"
              :on-confirm="
                () => {
                  settingVisible = false
                }
              "
            >
              <ErrorBoundary>
                <Setting
                  v-model:backtestConfig="backtestConfig"
                  v-model:strategyParams="strategyParams"
                  @update:backtestConfig="updateBacktestConfig"
                  @update:strategyParams="updateStrategyParam"
                />
              </ErrorBoundary>
            </t-dialog>
          </div>
        </div>
      </template>
    </t-card>

    <t-row :gutter="16">
      <t-col :span="6">
        <BacktestConfig v-model:backtestConfig="backtestConfig" />
        <StrategyParams
          v-model:strategyParams="strategyParams"
          v-model:backtestConfig="backtestConfig"
        />
      </t-col>

      <t-col :span="6">
        <ResultCard :backtestResult="backtestResult" :isRunning="isRunning" />
      </t-col>

      <t-card
        :title="t('pages.backtest.template.cards.profitChart')"
        class="chart-card"
        v-if="backtestResult"
      >
        <div ref="chartContainer" class="chart-container"></div>
      </t-card>

      <t-card
        :title="t('pages.backtest.template.cards.tradeRecords')"
        class="trades-card"
        v-if="backtestResult"
      >
        <t-table
          :data="backtestResult.trades"
          :columns="tradeColumns"
          :pagination="pagination"
          :hover="true"
          :stripe="true"
          row-key="id"
        />
      </t-card>
    </t-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onBeforeUnmount, toRaw } from 'vue'
import { PlayIcon, SettingIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

import { useBacktestStore } from '@/stores'
import { getStocks } from '@/services/client'
import { throttle } from '@/infrastructure/utils'
import { t } from '@/infrastructure/locales'
import { backtestStorage } from '@/infrastructure/utils'
import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary.vue'

import { getOption, tradeColumns } from '.'
import Setting from './components/Setting.vue'
import ResultCard from './components/ResultCard.vue'
import BacktestConfig from './components/BacktestConfig.vue'
import StrategyParams from './components/StrategyParams.vue'

const settingVisible = ref(false)
const backtestStore = useBacktestStore()

const backtestConfig = reactive({
  strategy: 'ma_cross',
  symbol: '000001',
  dateRange: ['2024-01-01', '2025-01-01'],
  initialCapital: 100000,
  commission: 0.0003,
})

const strategyParams = reactive({
  holdingPeriod: 15,
  shareHoldingLimit: 15,
  profitHoldThreshold: 5,
  trailingStopPercent: 3,
  stopLossLimit: 5,
  shortPeriod: 5,
  longPeriod: 20,
  rsiPeriod: 14,
  overbought: 70,
  oversold: 30,
  bollingerBandsPeriod: 20,
  standardDeviationMultiple: 2,
})

const isRunning = ref(false)
const backtestResult = ref(null)
const chartContainer = ref(null)

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
})

const runBacktest = throttle(
  async () => {
    isRunning.value = true

    const stocksData = await getStocks(backtestConfig.dateRange)

    const getBacktestResult = backtestStore.getBacktestResult.isCustomCode
      ? backtestStore.getBacktestResult.func
      : backtestStore.getBacktestResult.defaultFunc

    backtestResult.value = await getBacktestResult(backtestConfig, strategyParams, stocksData)

    pagination.total = backtestResult.value.trades.length

    isRunning.value = false

    await saveBacktest({
      date: dayjs().format('YYYY-MM-DD HH:mm'),
      backtestConfig: toRaw(backtestConfig), // 解包响应式对象
      strategyParams: toRaw(strategyParams),
      backtestResult: toRaw(backtestResult.value),
      isCustomCode: toRaw(backtestStore.getBacktestResult.isCustomCode),
      stocksData: toRaw(stocksData),
    })

    // 渲染图表
    await nextTick()
    renderChart(backtestResult.value.trades)
    MessagePlugin.success(t('pages.backtest.template.messages.success'))
  },
  5000,
  () => {
    MessagePlugin.info(t('pages.backtest.template.messages.tooFrequent'))
  },
)

const updateBacktestConfig = (newBacktestConfig) => {
  settingVisible.value = false
  for (const key in newBacktestConfig) {
    backtestConfig[key] = newBacktestConfig[key]
  }
}

const updateStrategyParam = (newStrategyParams) => {
  settingVisible.value = false
  for (const key in newStrategyParams) {
    strategyParams[key] = newStrategyParams[key]
  }
}

const renderChart = (data) => {
  if (!chartContainer.value || !backtestResult.value) return

  const chartInstance = echarts.init(chartContainer.value)

  const sortedData = data.filter((item) => item.type === '卖出')

  chartInstance.setOption(getOption(sortedData))
}

async function saveBacktest(data) {
  await backtestStorage.saveBacktestRecord(data)
}

onMounted(async () => {
  await nextTick()
  if (backtestStore.getBacktestResult.isCustomCode) {
    runBacktest()
  }
  try {
    await backtestStorage.init()
  } catch (error) {
    console.error('回测存储操作失败:', error)
  }
})
onBeforeUnmount(() => {
  backtestStorage.close()
})
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
