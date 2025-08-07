<template>
  <t-card title="回测结果" class="result-card">
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

    <!-- 空状态 -->
    <div class="empty" v-if="!backtestResult && !isRunning">
      <t-empty description="请配置参数并开始回测" />
    </div>
    <!-- 加载状态 -->
    <div v-if="isRunning" class="loading-container">
      <t-loading size="large" text="正在进行回测计算..." />
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps({
  backtestResult: {
    type: Object,
    default: null,
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
})

// 定义指标配置
const metricsConfig = [
  // 收益指标
  {
    label: '总收益率',
    field: 'totalReturn',
    type: 'percent',
    positive: true,
    tip: '整个回测期间的总收益百分比，负值表示亏损',
  },
  {
    label: '年化收益率',
    field: 'annualReturn',
    type: 'percent',
    positive: true,
    tip: '将总收益率折算为年度平均收益率，便于与其他投资比较',
  },
  // 风险指标
  {
    label: '最大回撤',
    field: 'maxDrawdown',
    type: 'percent',
    positive: false,
    tip: '从最高点到最低点的最大亏损幅度，反映策略的风险控制能力',
  },
  {
    label: '夏普比率',
    field: 'sharpeRatio',
    type: 'number',
    tip: '衡量风险调整后的收益，负值表示收益低于无风险利率（如国债），波动过大',
  },
  {
    label: '波动率',
    field: 'volatility',
    type: 'custom',
    formatter: (value) => adjustToRange(value),
    tip: '收益率的年化标准差，数值极高表明策略收益极不稳定（可能因高频交易或杠杆）',
  },
  {
    label: 'Beta值',
    field: 'Beta',
    type: 'number',
    tip: '策略相对于大盘的波动性，1表示与市场波动一致，小于1表示波动小于市场',
  },
  // 交易统计
  {
    label: '交易次数',
    field: 'totalTrades',
    type: 'integer',
    tip: '回测期间的总交易笔数',
  },
  {
    label: '胜率',
    field: 'winRate',
    type: 'percent',
    positive: (value) => value > 0.5,
    tip: '盈利交易占总交易次数的比例，较低胜率需结合盈亏比分析策略有效性',
  },
  {
    label: '平均盈利',
    field: 'avgWin',
    type: 'custom',
    formatter: (value) => adjustToRange(value) + '%',
    positive: true,
    tip: '盈利交易的平均收益率，需与平均亏损比较评估风险收益比',
  },
  {
    label: '平均亏损',
    field: 'avgLoss',
    type: 'custom',
    formatter: (value) => adjustToRange(value) + '%',
    positive: false,
    tip: '亏损交易的平均亏损率，远高于平均盈利时表明止损或选股可能存在问题',
  },
  // 其他分析指标
  {
    label: '持仓周期',
    field: 'positionPeriod',
    type: 'integer',
    suffix: '天',
    tip: '平均持仓天数，反映策略类型（如日内交易为1天，长线投资则数值较大）',
  },
  {
    label: '仓位利用率',
    field: 'positionUtilizationRate',
    type: 'custom',
    formatter: (value) => (value >= 1 ? '全仓' : '半仓'),
    tip: '资金使用效率，异常负值可能表示频繁做空或杠杆操作，需检查计算逻辑',
  },
  {
    label: '相关性分析',
    field: 'correlationAnalysis',
    type: 'number',
    tip: '策略收益与大盘收益的相关系数，接近1表示高度依赖市场行情，缺乏独立性',
  },
  {
    label: '板块分布',
    field: 'sectorDistribution',
    type: 'custom',
    formatter: (value) => (value >= 2 ? '高度依赖' : '较依赖'),
    tip: '策略收益在行业板块的集中程度，分散性不足时易受特定板块波动影响',
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

// 获取值的样式类
const getValueClass = (value, metric) => {
  if (metric.positive === undefined) return ''

  if (typeof metric.positive === 'function') {
    return metric.positive(value) ? 'positive' : 'negative'
  }

  return value >= 0 === metric.positive ? 'positive' : 'negative'
}
</script>

<style lang="less">
@import url(../index.less);
</style>
