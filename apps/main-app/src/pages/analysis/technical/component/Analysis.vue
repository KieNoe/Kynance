<template>
  <t-card class="analysis-report">
    <template #header>
      <div class="report-header">
        <t-space>
          <t-button @click="generateReport">{{
            t('pages.analysis.technical.analysis.generate')
          }}</t-button>
          <t-button @click="exportReport" :disabled="!report">{{
            t('pages.analysis.technical.analysis.export')
          }}</t-button>
        </t-space>
      </div>
    </template>

    <t-loading :loading="loading" :text="t('pages.analysis.technical.analysis.loading')">
      <div class="analysis-content" v-if="report">
        <!-- 基本价格分析 -->
        <t-collapse :default-expand-all="true">
          <t-collapse-panel
            :header="t('pages.analysis.technical.analysis.priceAnalysis')"
            value="1"
          >
            <div class="analysis-section">
              <p v-html="report.priceAnalysis"></p>
            </div>
          </t-collapse-panel>

          <!-- 交易量分析 -->
          <t-collapse-panel
            :header="t('pages.analysis.technical.analysis.volumeAnalysis')"
            value="2"
          >
            <div class="analysis-section">
              <p v-html="report.volumeAnalysis"></p>
            </div>
          </t-collapse-panel>

          <!-- 价格趋势分析 -->
          <t-collapse-panel
            :header="t('pages.analysis.technical.analysis.trendAnalysis')"
            value="3"
          >
            <div class="analysis-section">
              <p v-html="report.trendAnalysis"></p>
            </div>
          </t-collapse-panel>

          <!-- 市场状态分析 -->
          <t-collapse-panel :header="t('pages.analysis.technical.analysis.marketState')" value="4">
            <div class="analysis-section">
              <p v-html="report.marketStateAnalysis"></p>
            </div>
          </t-collapse-panel>

          <!-- 买卖盘分析 -->
          <t-collapse-panel
            :header="t('pages.analysis.technical.analysis.bidAskAnalysis')"
            value="5"
          >
            <div class="analysis-section">
              <p v-html="report.bidAskAnalysis"></p>
              <div class="bid-ask-ratio">
                <t-progress
                  :percentage="bidAskRatio.bidPercentage"
                  :color="{ from: '#00a870', to: '#00a870' }"
                  :label="false"
                />
                <div class="bid-ask-labels">
                  <span class="bid-label"
                    >买盘: {{ formatNumber(latestData?.bidSize) }} ({{
                      bidAskRatio.bidPercentage
                    }}%)</span
                  >
                  <span class="ask-label"
                    >卖盘: {{ formatNumber(latestData?.askSize) }} ({{
                      bidAskRatio.askPercentage
                    }}%)</span
                  >
                </div>
              </div>
            </div>
          </t-collapse-panel>

          <!-- 综合评估 -->
          <t-collapse-panel
            :header="t('pages.analysis.technical.analysis.overallAssessment')"
            value="6"
          >
            <div class="analysis-section">
              <div class="assessment-summary">
                <p v-html="report.overallAssessment"></p>
              </div>
              <div class="assessment-details">
                <t-row :gutter="[16, 16]">
                  <t-col :span="6" v-for="(item, index) in assessmentItems" :key="index">
                    <t-card size="small" :bordered="true" :hover="true" class="assessment-card">
                      <div class="assessment-item">
                        <div class="assessment-header">
                          <span class="item-name">{{ item.name }}</span>
                          <t-tag :theme="getTagTheme(item.value)" size="medium">{{
                            item.value
                          }}</t-tag>
                        </div>
                        <div class="assessment-indicator">
                          <div class="indicator-bar">
                            <div
                              class="indicator-value"
                              :style="{
                                width: getIndicatorWidth(item.value),
                                backgroundColor: getIndicatorColor(item.value),
                              }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </t-card>
                  </t-col>
                </t-row>
              </div>
            </div>
          </t-collapse-panel>
        </t-collapse>
      </div>
      <div class="no-data" v-else-if="!loading">
        <t-empty>
          <template #extra>
            <t-button @click="generateReport">{{
              t('pages.analysis.technical.analysis.generate')
            }}</t-button>
          </template>
        </t-empty>
      </div>
    </t-loading>
  </t-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import html2pdf from 'html2pdf.js'

import { useStockDataStore } from '@/stores'
import { t } from '@/infrastructure/locales'

const stockDataStore = useStockDataStore()
const loading = ref(false)
const report = ref(null)

// 计算最新数据
const latestData = computed(() => {
  const data = stockDataStore.stockData.default.data
  return data && data.length > 0 ? data[data.length - 1] : null
})

// 计算买卖盘比例
const bidAskRatio = computed(() => {
  if (!latestData.value) return { bidPercentage: 50, askPercentage: 50 }

  const bidSize = latestData.value.bidSize || 0
  const askSize = latestData.value.askSize || 0
  const total = bidSize + askSize

  if (total === 0) return { bidPercentage: 50, askPercentage: 50 }

  const bidPercentage = Math.round((bidSize / total) * 100)
  const askPercentage = 100 - bidPercentage

  return { bidPercentage, askPercentage }
})

// 评估项目
const assessmentItems = ref([])

// 格式化数字
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return num.toLocaleString()
}

// 获取标签主题
const getTagTheme = (value) => {
  if (value === '强烈看多' || value === '看多') return 'success'
  if (value === '中性偏多') return 'primary'
  if (value === '中性') return 'warning'
  if (value === '中性偏空') return 'danger'
  if (value === '看空' || value === '强烈看空') return 'danger'
  return 'default'
}

// 获取指标条宽度
const getIndicatorWidth = (value) => {
  switch (value) {
    case '强烈看多':
      return '90%'
    case '看多':
      return '75%'
    case '中性偏多':
      return '65%'
    case '中性':
      return '50%'
    case '中性偏空':
      return '35%'
    case '看空':
      return '25%'
    case '强烈看空':
      return '10%'
    case '高波动':
      return '85%'
    case '中高波动':
      return '70%'
    case '中低波动':
      return '30%'
    case '低波动':
      return '15%'
    default:
      return '50%'
  }
}

// 获取指标条颜色
const getIndicatorColor = (value) => {
  if (value === '强烈看多' || value === '看多') return '#00a870'
  if (value === '中性偏多') return '#2a7af2'
  if (value === '中性') return '#ed7b2f'
  if (value === '中性偏空') return '#e34d59'
  if (value === '看空' || value === '强烈看空') return '#d54941'
  if (value === '高波动' || value === '中高波动') return '#e34d59'
  if (value === '中低波动' || value === '低波动') return '#00a870'
  return '#ed7b2f'
}

// 导出报告为PDF
const exportReport = async () => {
  if (!report.value) {
    MessagePlugin.warning('请先生成分析报告')
    return
  }

  try {
    loading.value = true
    const element = document.querySelector('.analysis-content')

    const opt = {
      margin: 10,
      filename: '股票分析报告.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }

    await html2pdf().set(opt).from(element).save()
    MessagePlugin.success('报告导出成功')
  } catch (error) {
    console.error('导出报告失败:', error)
    MessagePlugin.error('导出报告失败')
  } finally {
    loading.value = false
  }
}

// 生成分析报告
const generateReport = async () => {
  loading.value = true

  try {
    // 从store获取数据或使用传入的数据
    const data = stockDataStore.stockData.default.data || props.stockData

    if (!data || data.length === 0) {
      MessagePlugin.error('没有可用的股票数据')
      loading.value = false
      return
    }

    // 生成报告内容
    report.value = analyzeStockData(data)

    // 更新评估项目
    assessmentItems.value = [
      { name: '价格趋势', value: report.value.priceTrend },
      { name: '成交量', value: report.value.volumeAssessment },
      { name: '价格波动', value: report.value.volatilityAssessment },
      { name: '市场状态', value: report.value.marketStateAssessment },
      { name: '买卖盘', value: report.value.bidAskAssessment },
      { name: '短期展望', value: report.value.shortTermOutlook },
    ]
  } catch (error) {
    console.error('生成分析报告失败:', error)
    MessagePlugin.error('生成分析报告失败')
  } finally {
    loading.value = false
  }
}

// 分析股票数据
const analyzeStockData = (data) => {
  // 获取最新数据和历史数据
  const latest = data[data.length - 1]
  const previousDay = data.length > 1 ? data[data.length - 2] : null
  const historyDays = Math.min(data.length, 20) // 分析最近20天数据
  const historyData = data.slice(-historyDays)

  // 1. 价格分析
  const priceChange = latest.change
  const priceChangePercent = latest.changePercent
  const priceDirection = priceChange > 0 ? '上涨' : priceChange < 0 ? '下跌' : '持平'
  const priceStrength =
    Math.abs(priceChangePercent) > 2 ? '显著' : Math.abs(priceChangePercent) > 1 ? '适度' : '轻微'

  // 计算价格趋势
  let upDays = 0
  let downDays = 0
  for (let i = 1; i < historyData.length; i++) {
    if (historyData[i].close > historyData[i - 1].close) upDays++
    else if (historyData[i].close < historyData[i - 1].close) downDays++
  }

  let priceTrend = '中性'
  if (upDays > historyData.length * 0.7) {
    priceTrend = '强烈看多'
  } else if (upDays > historyData.length * 0.6) {
    priceTrend = '看多'
  } else if (upDays > historyData.length * 0.55) {
    priceTrend = '中性偏多'
  } else if (downDays > historyData.length * 0.7) {
    priceTrend = '强烈看空'
  } else if (downDays > historyData.length * 0.6) {
    priceTrend = '看空'
  } else if (downDays > historyData.length * 0.55) {
    priceTrend = '中性偏空'
  }

  const priceAnalysis = `
    <p>当前价格 <strong>${latest.close.toFixed(2)}</strong>，较前一交易日${priceDirection} <strong>${Math.abs(priceChange).toFixed(2)}</strong> 点 (${priceChangePercent.toFixed(2)}%)，属于${priceStrength}${priceDirection}。</p>
    <p>今日开盘价 ${latest.open.toFixed(2)}，最高价 ${latest.high.toFixed(2)}，最低价 ${latest.low.toFixed(2)}。</p>
    <p>日内波动幅度为 ${(((latest.high - latest.low) / latest.low) * 100).toFixed(2)}%，${((latest.high - latest.low) / latest.low) * 100 > 2 ? '波动较大' : '波动较小'}。</p>
  `

  // 2. 交易量分析
  const volumeChange = previousDay
    ? Number((((latest.volume - previousDay.volume) / previousDay.volume) * 100).toFixed(2))
    : 0
  const volumeDirection = volumeChange > 0 ? '增加' : '减少'
  const volumeStrength =
    Math.abs(volumeChange) > 20 ? '显著' : Math.abs(volumeChange) > 10 ? '适度' : '轻微'

  // 计算平均成交量
  const avgVolume = historyData.reduce((sum, item) => sum + item.volume, 0) / historyData.length
  const volumeRatio = latest.volume / avgVolume

  let volumeAssessment = '中性'
  if (volumeRatio > 1.5 && priceChange > 0) {
    volumeAssessment = '看多'
  } else if (volumeRatio > 1.5 && priceChange < 0) {
    volumeAssessment = '看空'
  } else if (volumeRatio > 1.2 && priceChange > 0) {
    volumeAssessment = '中性偏多'
  } else if (volumeRatio > 1.2 && priceChange < 0) {
    volumeAssessment = '中性偏空'
  }

  const volumeAnalysis = `
    <p>今日成交量 <strong>${formatNumber(latest.volume)}</strong>，较前一交易日${volumeDirection} <strong>${Math.abs(volumeChange)}%</strong>，属于${volumeStrength}${volumeDirection}。</p>
    <p>成交量${priceChange > 0 ? '配合价格上涨' : priceChange < 0 ? '配合价格下跌' : '在价格持平的情况下变化'}，表明市场${volumeAssessment === '看多' ? '买盘力量强劲' : volumeAssessment === '看空' ? '卖盘压力较大' : '交投相对平稳'}。</p>
  `

  // 3. 价格趋势分析
  // 计算价格波动性
  let priceSum = 0
  let volatility = 0
  for (let i = 0; i < historyData.length; i++) {
    priceSum += historyData[i].close
  }
  const avgPrice = priceSum / historyData.length

  for (let i = 0; i < historyData.length; i++) {
    volatility += Math.pow(historyData[i].close - avgPrice, 2)
  }
  volatility = (Math.sqrt(volatility / historyData.length) / avgPrice) * 100

  let volatilityAssessment = '中性'
  if (volatility > 3) {
    volatilityAssessment = volatility > 5 ? '高波动' : '中高波动'
  } else if (volatility < 1) {
    volatilityAssessment = volatility < 0.5 ? '低波动' : '中低波动'
  }

  const trendAnalysis = `
    <p>过去${historyDays}个交易日中，股价上涨${upDays}天，下跌${downDays}天，持平${historyDays - upDays - downDays - 1}天。</p>
    <p>价格波动率为 <strong>${volatility.toFixed(2)}%</strong>，属于${volatilityAssessment}。</p>
    <p>从价格形态来看，当前处于<strong>${priceTrend}</strong>趋势。</p>
    <p>${
      priceTrend.includes('看多')
        ? '近期价格呈现上升趋势，市场情绪偏向乐观。'
        : priceTrend.includes('看空')
          ? '近期价格呈现下降趋势，市场情绪偏向谨慎。'
          : '近期价格呈现震荡整理，市场情绪较为中性。'
    }</p>
  `

  // 4. 市场状态分析
  const marketState = latest.marketState || 'NORMAL'
  let marketStateAssessment = '中性'
  let marketStateAnalysis = ''

  switch (marketState) {
    case 'PRE':
      marketStateAnalysis =
        '<p>当前处于盘前交易时段，市场尚未正式开盘，价格和交易量可能波动较大。</p>'
      marketStateAssessment = '中性'
      break
    case 'REGULAR':
    case 'NORMAL':
      marketStateAnalysis =
        '<p>当前处于正常交易时段，市场流动性充足，价格反映了市场的真实供需关系。</p>'
      marketStateAssessment = '中性'
      break
    case 'POST':
      marketStateAnalysis =
        '<p>当前处于盘后交易时段，交易量通常较低，价格波动可能不具有很强的参考意义。</p>'
      marketStateAssessment = '中性'
      break
    case 'CLOSED':
      marketStateAnalysis = '<p>市场已收盘，当前显示的是最后一个交易日的收盘数据。</p>'
      marketStateAssessment = '中性'
      break
    default:
      marketStateAnalysis = `<p>当前市场状态为 ${marketState}。</p>`
      marketStateAssessment = '中性'
  }

  // 5. 买卖盘分析
  const bidSize = latest.bidSize || 0
  const askSize = latest.askSize || 0
  const spread = latest.spread || 0

  let bidAskAssessment = '中性'
  if (bidSize > askSize * 1.5) {
    bidAskAssessment = '看多'
  } else if (askSize > bidSize * 1.5) {
    bidAskAssessment = '看空'
  } else if (bidSize > askSize * 1.2) {
    bidAskAssessment = '中性偏多'
  } else if (askSize > bidSize * 1.2) {
    bidAskAssessment = '中性偏空'
  }

  const bidAskAnalysis = `
    <p>当前买盘量为 <strong>${formatNumber(bidSize)}</strong>，卖盘量为 <strong>${formatNumber(askSize)}</strong>，买卖比为 <strong>${(bidSize / askSize).toFixed(2)}</strong>。</p>
    <p>买卖价差为 <strong>${spread.toFixed(4)}</strong>，表明市场流动性${spread < 0.01 ? '非常充足' : spread < 0.05 ? '较为充足' : '一般'}。</p>
    <p>从买卖盘对比来看，当前市场${bidAskAssessment === '看多' ? '买盘明显强于卖盘，存在上涨动能' : bidAskAssessment === '看空' ? '卖盘明显强于买盘，存在下跌压力' : bidAskAssessment === '中性偏多' ? '买盘略强于卖盘' : bidAskAssessment === '中性偏空' ? '卖盘略强于买盘' : '买卖力量相对平衡'}。</p>
  `

  // 6. 短期展望
  let shortTermOutlook = '中性'
  // 综合各项指标评估短期展望
  const factors = [
    { value: priceTrend, weight: 0.3 },
    { value: volumeAssessment, weight: 0.2 },
    { value: bidAskAssessment, weight: 0.3 },
    { value: marketStateAssessment, weight: 0.1 },
    {
      value:
        volatilityAssessment === '高波动'
          ? '中性偏空'
          : volatilityAssessment === '低波动'
            ? '中性偏多'
            : '中性',
      weight: 0.1,
    },
  ]

  // 评分系统
  const scoreMap = {
    强烈看多: 2,
    看多: 1,
    中性偏多: 0.5,
    中性: 0,
    中性偏空: -0.5,
    看空: -1,
    强烈看空: -2,
    高波动: -0.5,
    中高波动: -0.25,
    中低波动: 0.25,
    低波动: 0.5,
  }

  // 计算加权评分
  const totalScore = factors.reduce((sum, factor) => {
    return sum + (scoreMap[factor.value] || 0) * factor.weight
  }, 0)

  // 根据评分确定综合评级
  let rating = '中性'
  if (totalScore > 0.75) {
    rating = '看多'
    shortTermOutlook = '看多'
  } else if (totalScore > 0.25) {
    rating = '中性偏多'
    shortTermOutlook = '中性偏多'
  } else if (totalScore < -0.75) {
    rating = '看空'
    shortTermOutlook = '看空'
  } else if (totalScore < -0.25) {
    rating = '中性偏空'
    shortTermOutlook = '中性偏空'
  }

  // 生成综合评估文本
  const overallAssessment = `
    <p>综合各项技术指标分析，当前市场整体评级为 <strong>${rating}</strong>。</p>
    <p>${
      rating === '看多'
        ? '多项指标显示市场处于上升趋势，短期内可能继续上涨。'
        : rating === '中性偏多'
          ? '指标偏向积极，市场可能有小幅上涨空间，但上涨动能有限。'
          : rating === '中性'
            ? '指标显示市场处于盘整状态，短期内可能维持区间波动。'
            : rating === '中性偏空'
              ? '指标偏向消极，市场可能有小幅下跌风险，建议保持谨慎。'
              : '多项指标显示市场处于下降趋势，短期内可能继续下跌，建议规避风险。'
    }</p>
    <p>建议操作：${
      rating === '看多'
        ? '可考虑逢低买入，持有多头头寸。'
        : rating === '中性偏多'
          ? '可小仓位试探性买入，设置止损。'
          : rating === '中性'
            ? '观望为主，等待更明确的市场信号。'
            : rating === '中性偏空'
              ? '减持部分仓位，控制风险敞口。'
              : '可考虑减仓或做空，注意控制风险。'
    }</p>
  `

  return {
    priceAnalysis,
    volumeAnalysis,
    trendAnalysis,
    marketStateAnalysis,
    bidAskAnalysis,
    overallAssessment,
    priceTrend,
    volumeAssessment,
    volatilityAssessment,
    marketStateAssessment,
    bidAskAssessment,
    shortTermOutlook,
    rating,
  }
}

// 可以接收外部传入的股票数据
const props = defineProps({
  stockData: {
    type: Array,
    default: () => [],
  },
})

// 如果有传入数据，自动生成报告
onMounted(() => {
  if (props.stockData && props.stockData.length > 0) {
    generateReport()
  }
})
</script>

<style lang="less" scoped>
.analysis-report {
  margin-bottom: 20px;

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.analysis-section {
  margin-bottom: 16px;
}

.assessment {
  &-summary {
    margin-bottom: 16px;
  }

  &-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 8px 0;
    flex: 1;
    justify-content: space-between;
  }

  &-card {
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }
  }

  &-value {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &-indicator {
    width: 100%;
    margin-top: 4px;
  }
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.indicator {
  &-bar {
    height: 6px;
    width: 100%;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
  }

  &-value {
    height: 100%;
    border-radius: 3px;
    transition:
      width 0.5s ease,
      background-color 0.5s ease;
  }
}

.bid-ask {
  &-ratio {
    margin-top: 16px;
  }

  &-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }
}

.bid-label {
  color: #00a870;
}

.ask-label {
  color: #e34d59;
}

.no-data {
  padding: 40px 0;
}
</style>
