<template>
  <t-card :title="t('pages.backtest.template.resultCard.title')" class="result-card">
    <t-row :gutter="16" v-if="backtestResult">
      <!-- 收益指标 -->
      <t-col v-for="metric in returnMetrics" :key="metric.label" :span="6">
        <div class="metric-item">
          <t-tooltip :content="metric.tip">
            <div class="metric-label">{{ metric.label }}</div>
          </t-tooltip>
          <div class="metric-value" :class="getValueClass(backtestResult[metric.field], metric)">
            {{ formatValue(backtestResult[metric.field], metric) }}
          </div>
        </div>
      </t-col>
    </t-row>

    <t-row :gutter="16" v-if="backtestResult" class="second-row">
      <!-- 风险指标和其他指标 -->
      <t-col v-for="metric in otherMetrics" :key="metric.label" :span="6">
        <div class="metric-item">
          <t-tooltip :content="metric.tip">
            <div class="metric-label">{{ metric.label }}</div>
          </t-tooltip>
          <div class="metric-value" :class="getValueClass(backtestResult[metric.field], metric)">
            {{ formatValue(backtestResult[metric.field], metric) }}
          </div>
        </div>
      </t-col>
    </t-row>
    <div
      class="tag"
      style="width: 100%; display: flex; justify-content: center"
      v-if="backtestResult"
    >
      <t-tag
        variant="light"
        size="large"
        shape="round"
        style="margin-top: 1rem; cursor: default; user-select: none"
        @click="onTagClick"
        :color="getTagColor()"
        >{{ t('pages.backtest.template.resultCard.comment') + getTag() }}</t-tag
      >
      <t-dialog
        v-model:visible="visible"
        :header="t('pages.backtest.template.resultCard.easterEgg.title')"
        width="40%"
        top="1%"
      >
        <p>{{ t('pages.backtest.template.resultCard.easterEgg.content') }}</p>
        <img :src="Egg" width="100%" />
      </t-dialog>
    </div>
    <!-- 空状态 -->
    <div class="empty" v-if="!backtestResult && !isRunning">
      <t-empty :description="t('pages.backtest.template.resultCard.emptyState')" />
    </div>
    <!-- 加载状态 -->
    <div v-if="isRunning" class="loading-container">
      <t-loading size="large" :text="t('pages.backtest.template.resultCard.loading')" />
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'
import { computed, ref } from 'vue'

import Egg from '@/assets/assets-coloredEgg.png'
import { t } from '@/infrastructure/locales'

const props = defineProps({
  backtestResult: {
    type: Object,
    default: null,
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
})

let num = 0
const visible = ref(false)

// 定义指标配置
const metricsConfig = [
  // 收益指标
  {
    label: t('pages.backtest.template.resultCard.metrics.totalReturn.label'),
    field: 'totalReturn',
    type: 'percent',
    positive: true,
    tip: t('pages.backtest.template.resultCard.metrics.totalReturn.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.annualReturn.label'),
    field: 'annualReturn',
    type: 'percent',
    positive: true,
    tip: t('pages.backtest.template.resultCard.metrics.annualReturn.tip'),
  },
  // 风险指标
  {
    label: t('pages.backtest.template.resultCard.metrics.maxDrawdown.label'),
    field: 'maxDrawdown',
    type: 'percent',
    positive: false,
    tip: t('pages.backtest.template.resultCard.metrics.maxDrawdown.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.sharpeRatio.label'),
    field: 'sharpeRatio',
    type: 'number',
    tip: t('pages.backtest.template.resultCard.metrics.sharpeRatio.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.volatility.label'),
    field: 'volatility',
    type: 'custom',
    formatter: (value) => adjustToRange(value) + '%',
    tip: t('pages.backtest.template.resultCard.metrics.volatility.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.Beta.label'),
    field: 'Beta',
    type: 'number',
    tip: t('pages.backtest.template.resultCard.metrics.Beta.tip'),
  },
  // 交易统计
  {
    label: t('pages.backtest.template.resultCard.metrics.totalTrades.label'),
    field: 'totalTrades',
    type: 'integer',
    tip: t('pages.backtest.template.resultCard.metrics.totalTrades.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.winRate.label'),
    field: 'winRate',
    type: 'percent',
    positive: (value) => value > 0.5,
    tip: t('pages.backtest.template.resultCard.metrics.winRate.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.avgWin.label'),
    field: 'avgWin',
    type: 'custom',
    formatter: (value) => adjustToRange(value) + '%',
    positive: true,
    tip: t('pages.backtest.template.resultCard.metrics.avgWin.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.avgLoss.label'),
    field: 'avgLoss',
    type: 'custom',
    formatter: (value) => adjustToRange(value) + '%',
    positive: false,
    tip: t('pages.backtest.template.resultCard.metrics.avgLoss.tip'),
  },
  // 其他分析指标
  {
    label: t('pages.backtest.template.resultCard.metrics.positionPeriod.label'),
    field: 'positionPeriod',
    type: 'integer',
    suffix: t('pages.backtest.template.resultCard.metrics.positionPeriod.suffix'),
    tip: t('pages.backtest.template.resultCard.metrics.positionPeriod.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.positionUtilizationRate.label'),
    field: 'positionUtilizationRate',
    type: 'custom',
    formatter: (value) => (value >= 1 ? '全仓' : '半仓'),
    tip: t('pages.backtest.template.resultCard.metrics.positionUtilizationRate.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.correlationAnalysis.label'),
    field: 'correlationAnalysis',
    type: 'number',
    tip: t('pages.backtest.template.resultCard.metrics.correlationAnalysis.tip'),
  },
  {
    label: t('pages.backtest.template.resultCard.metrics.sectorDistribution.label'),
    field: 'sectorDistribution',
    type: 'custom',
    formatter: (value) =>
      value >= 2
        ? t('pages.backtest.template.resultCard.metrics.sectorDistribution.formatter.high')
        : t('pages.backtest.template.resultCard.metrics.sectorDistribution.formatter.medium'),
    tip: t('pages.backtest.template.resultCard.metrics.sectorDistribution.tip'),
  },
]

// 分割指标为两部分显示
const returnMetrics = computed(() => metricsConfig.slice(0, 6))
const otherMetrics = computed(() => metricsConfig.slice(6))

// 格式化值
const formatValue = (value, metric) => {
  if (value === undefined || value === null) return '-'

  switch (metric.type) {
    case 'percent':
      return `${(value * 100).toFixed(2)}%`
    case 'number':
      return value.toFixed(2)
    case 'integer':
      return value.toString()
    case 'custom':
      return metric.formatter(value)
    default:
      return value
  }
}

function adjustToRange(value) {
  if (value === 0) return '0.00'

  const scalePower = Math.floor(Math.log10(value)) - 1
  const scaleFactor = Math.pow(10, scalePower)

  const adjustedValue = value / scaleFactor

  const clampedValue = Math.min(Math.max(adjustedValue, 10), 100)

  return clampedValue.toFixed(2)
}

const getValueClass = (value, metric) => {
  if (metric.positive === undefined) return ''

  if (typeof metric.positive === 'function') {
    return metric.positive(value) ? 'positive' : 'negative'
  }

  return value >= 0 === metric.positive ? 'positive' : 'negative'
}

const getTag = () => {
  const returnPercentage = Number(props.backtestResult.totalReturn * 100)

  const performanceLevels = [
    {
      threshold: -30,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.veryBad.one'),
        t('pages.backtest.template.resultCard.performanceLevels.veryBad.second'),
        t('pages.backtest.template.resultCard.performanceLevels.veryBad.third'),
      ],
    },
    {
      threshold: -10,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.bad.one'),
        t('pages.backtest.template.resultCard.performanceLevels.bad.second'),
        t('pages.backtest.template.resultCard.performanceLevels.bad.third'),
      ],
    },
    {
      threshold: 0,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.neutral.one'),
        t('pages.backtest.template.resultCard.performanceLevels.neutral.second'),
        t('pages.backtest.template.resultCard.performanceLevels.neutral.third'),
      ],
    },
    {
      threshold: 10,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.good.one'),
        t('pages.backtest.template.resultCard.performanceLevels.good.second'),
        t('pages.backtest.template.resultCard.performanceLevels.good.third'),
      ],
    },
    {
      threshold: 20,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.veryGood.one'),
        t('pages.backtest.template.resultCard.performanceLevels.veryGood.second'),
        t('pages.backtest.template.resultCard.performanceLevels.veryGood.third'),
      ],
    },
    {
      threshold: 50,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.excellent.one'),
        t('pages.backtest.template.resultCard.performanceLevels.excellent.second'),
        t('pages.backtest.template.resultCard.performanceLevels.excellent.third'),
      ],
    },
    {
      threshold: 100,
      messages: [
        t('pages.backtest.template.resultCard.performanceLevels.unbelievable.one'),
        t('pages.backtest.template.resultCard.performanceLevels.unbelievable.second'),
        t('pages.backtest.template.resultCard.performanceLevels.unbelievable.third'),
      ],
    },
    {
      threshold: Infinity,
      messages: [t('pages.backtest.template.resultCard.performanceLevels.legendary.one')],
    },
  ]

  for (const level of performanceLevels) {
    if (returnPercentage < level.threshold) {
      const randomIndex = Math.floor(Math.random() * level.messages.length)
      return level.messages[randomIndex]
    }
  }

  const lastLevel = performanceLevels[performanceLevels.length - 1]
  const randomIndex = Math.floor(Math.random() * lastLevel.messages.length)
  return lastLevel.messages[randomIndex]
}

const getTagColor = () => {
  const returnPercentage = Number(props.backtestResult.totalReturn * 100)
  if (returnPercentage >= 10) return '#e34d59'
  else if (returnPercentage <= -10) return '#00a870'
}

const onTagClick = () => {
  if (num >= 8) {
    visible.value = true
  } else {
    MessagePlugin.info(t('pages.backtest.template.resultCard.easterEggHint'))
    num++
  }
}
</script>

<style lang="less">
@import url(../index.less);
</style>
