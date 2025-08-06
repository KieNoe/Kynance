<template>
  <div class="backtest-container">
    <!-- 页面标题 -->
    <t-card class="header-card">
      <template #header>
        <div class="header-content">
          <h2>策略回测</h2>
          <div class="buttons">
            <t-button theme="primary" @click="runBacktest" :loading="isRunning">
              <template #icon><play-icon /></template>
              {{ isRunning ? '回测中...' : '开始回测' }}
            </t-button>
            <t-button variant="text" @click="saveBacktest" :loading="isRunning">
              <template #icon><SettingIcon /></template>
              {{ isRunning ? '回测中...' : '参数设置' }}
            </t-button>
          </div>
        </div>
      </template>
    </t-card>

    <t-row :gutter="16">
      <!-- 左侧配置面板 -->
      <t-col :span="6">
        <t-card title="回测配置" class="config-card">
          <t-form :data="backtestConfig" label-width="80px">
            <t-form-item label="策略名称">
              <t-select v-model="backtestConfig.strategy" placeholder="请选择策略">
                <t-option value="ma_cross" label="均线交叉策略" />
                <t-option value="rsi_reversal" label="RSI反转策略" />
                <t-option value="bollinger_bands" label="布林带策略" />
              </t-select>
            </t-form-item>

            <t-form-item label="股票代码">
              <t-input v-model="backtestConfig.symbol" placeholder="如：000001" />
            </t-form-item>

            <t-form-item label="回测周期">
              <t-date-range-picker
                v-model="backtestConfig.dateRange"
                format="YYYY-MM-DD"
                placeholder="选择回测时间范围"
              />
            </t-form-item>

            <t-form-item label="初始资金">
              <t-input-number
                v-model="backtestConfig.initialCapital"
                :min="10000"
                :max="10000000"
                suffix="元"
                style="width: 200px"
              />
            </t-form-item>

            <t-form-item label="手续费率">
              <t-input-number
                v-model="backtestConfig.commission"
                :min="0"
                :max="0.01"
                :step="0.0001"
                suffix="%"
                style="width: 200px"
              />
            </t-form-item>
          </t-form>
        </t-card>

        <!-- 策略参数 -->
        <t-card title="策略参数" class="params-card">
          <t-form :data="strategyParams" label-width="120px">
            <t-form-item label="持股上限">
              <t-input-number
                v-model="strategyParams.shareHoldingLimit"
                :min="1"
                :max="100"
                style="width: 158px"
              />
            </t-form-item>
            <t-form-item label="盈利达标持有">
              <t-input-number
                v-model="strategyParams.profitHoldThreshold"
                :min="1"
                :max="100"
                suffix="%"
                style="width: 158px"
              />
            </t-form-item>
            <t-form-item label="动态止盈保护">
              <t-input-number
                v-model="strategyParams.trailingStopPercent"
                :min="1"
                :max="50"
                suffix="%"
                style="width: 158px"
              />
            </t-form-item>
            <t-form-item label="风险控制止损">
              <t-input-number
                v-model="strategyParams.stopLossLimit"
                :min="1"
                :max="80"
                suffix="%"
                style="width: 158px"
              />
            </t-form-item>
            <template v-if="backtestConfig.strategy === 'ma_cross'">
              <t-form-item label="短期均线">
                <t-input-number
                  v-model="strategyParams.shortPeriod"
                  :min="5"
                  :max="50"
                  style="width: 158px"
                />
              </t-form-item>
              <t-form-item label="长期均线">
                <t-input-number
                  v-model="strategyParams.longPeriod"
                  :min="10"
                  :max="200"
                  style="width: 158px"
                />
              </t-form-item>
            </template>

            <template v-if="backtestConfig.strategy === 'rsi_reversal'">
              <t-form-item label="RSI周期">
                <t-input-number
                  v-model="strategyParams.rsiPeriod"
                  :min="5"
                  :max="30"
                  style="width: 158px"
                />
              </t-form-item>
              <t-form-item label="超买线">
                <t-input-number
                  v-model="strategyParams.overbought"
                  :min="70"
                  :max="90"
                  style="width: 158px"
                />
              </t-form-item>
              <t-form-item label="超卖线">
                <t-input-number
                  v-model="strategyParams.oversold"
                  :min="10"
                  :max="30"
                  style="width: 158px"
                />
              </t-form-item>
            </template>
            <template v-if="backtestConfig.strategy === 'bollinger_bands'">
              <t-form-item label="布林带周期">
                <t-input-number
                  v-model="strategyParams.bollingerBandsPeriod"
                  :min="5"
                  :max="50"
                  style="width: 158px"
                />
              </t-form-item>
              <t-form-item label="标准差倍数">
                <t-input-number
                  v-model="strategyParams.standardDeviationMultiple"
                  :min="1"
                  :max="50"
                  style="width: 158px"
                />
              </t-form-item>
            </template>
          </t-form>
        </t-card>
      </t-col>

      <!-- 右侧结果展示 -->
      <t-col :span="6">
        <!-- 回测结果概览 -->
        <t-card title="回测结果" class="result-card">
          <t-row :gutter="16" v-if="backtestResult || isRunning">
            <!-- 收益指标 -->
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">总收益率</div>
                <div
                  class="metric-value"
                  :class="backtestResult.totalReturn >= 0 ? 'positive' : 'negative'"
                >
                  {{ (backtestResult.totalReturn * 100).toFixed(2) }}%
                </div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">年化收益率</div>
                <div
                  class="metric-value"
                  :class="backtestResult.annualReturn >= 0 ? 'positive' : 'negative'"
                >
                  {{ (backtestResult.annualReturn * 100).toFixed(2) }}%
                </div>
              </div>
            </t-col>

            <!-- 风险指标 -->
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">最大回撤</div>
                <div class="metric-value negative">
                  {{ (backtestResult.maxDrawdown * 100).toFixed(2) }}%
                </div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">夏普比率</div>
                <div class="metric-value">
                  {{ backtestResult.sharpeRatio.toFixed(2) }}
                </div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">波动率</div>
                <div class="metric-value">{{ backtestResult.volatility.toFixed(2) }}%</div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">Beta值</div>
                <div class="metric-value">{{ backtestResult.Beta.toFixed(2) }}</div>
              </div>
            </t-col>
          </t-row>

          <t-row :gutter="16" v-if="backtestResult || isRunning" class="second-row">
            <!-- 交易统计 -->
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">交易次数</div>
                <div class="metric-value">{{ backtestResult.totalTrades }}</div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">胜率</div>
                <div
                  class="metric-value"
                  :class="backtestResult.winRate > 50 ? 'positive' : 'negative'"
                >
                  {{ (backtestResult.winRate * 100).toFixed(2) }}%
                </div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">平均盈利</div>
                <div class="metric-value positive">{{ backtestResult.avgWin.toFixed(2) }}%</div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">平均亏损</div>
                <div class="metric-value negative">{{ backtestResult.avgLoss.toFixed(2) }}%</div>
              </div>
            </t-col>

            <!-- 其他分析指标 -->
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">持仓周期</div>
                <div class="metric-value">{{ backtestResult.positionPeriod }}天</div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">仓位利用率</div>
                <div class="metric-value">
                  {{ backtestResult.positionUtilizationRate.toFixed(2) }}%
                </div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">相关性分析</div>
                <div class="metric-value">{{ backtestResult.correlationAnalysis.toFixed(2) }}</div>
              </div>
            </t-col>
            <t-col :span="6">
              <div class="metric-item">
                <div class="metric-label">板块分布</div>
                <div class="metric-value">
                  {{ backtestResult.sectorDistribution >= 2 ? '高度依赖' : '较依赖' }}
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
      </t-col>

      <!-- 收益曲线图表 -->
      <t-card title="收益曲线" class="chart-card" v-if="backtestResult">
        <div ref="chartContainer" class="chart-container"></div>
      </t-card>

      <!-- 交易记录 -->
      <t-card title="交易记录" class="trades-card" v-if="backtestResult">
        <t-table
          :data="backtestResult.trades"
          :columns="tradeColumns"
          :pagination="pagination"
          :hover="true"
          :onRowClick="onRowClick"
          :stripe="true"
          row-key="id"
        />
      </t-card>
    </t-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { PlayIcon, SaveIcon, File1Icon, SettingIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { generateBacktestResult } from '@kynance/strategy-engine'
import * as echarts from 'echarts'

import { getStocks } from '@/services/client'

// 回测配置
const backtestConfig = reactive({
  strategy: 'ma_cross',
  symbol: '000001',
  dateRange: ['2024-01-01', '2025-01-01'], //回测周期
  initialCapital: 100000, //初始资金
  commission: 0.0003, //手续费率
})

// 策略参数
const strategyParams = reactive({
  holdingPeriod: 15,
  shareHoldingLimit: 15,
  profitHoldThreshold: 5,
  trailingStopPercent: 3,
  stopLossLimit: 5,
  // 均线交叉策略参数:ma_cross
  shortPeriod: 5,
  longPeriod: 20,
  // RSI策略参数:rsi_reversal
  rsiPeriod: 14,
  overbought: 80,
  oversold: 20,
  //布林带策略参数:bollinger_bands
  bollingerBandsPeriod: 20,
  standardDeviationMultiple: 2,
})

// 回测状态
const isRunning = ref(false)
const backtestResult = ref(null)
const chartContainer = ref(null)

// 表格配置
const tradeColumns = [
  { colKey: 'date', title: '交易日期', width: 120 },
  { colKey: 'type', title: '交易类型', width: 80 },
  { colKey: 'price', title: '成交价格', width: 100 },
  { colKey: 'quantity', title: '交易数量', width: 100 },
  { colKey: 'amount', title: '交易金额', width: 120 },
  { colKey: 'profit', title: '盈亏', width: 100 },
  { colKey: 'totalValue', title: '总资产', width: 120 },
]

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
})

// 开始回测
const runBacktest = async () => {
  isRunning.value = true

  const stocksData = await getStocks(backtestConfig.dateRange, true)

  backtestResult.value = await generateBacktestResult(backtestConfig, strategyParams, stocksData)
  console.log(backtestResult.value)

  pagination.total = backtestResult.value.trades.length

  isRunning.value = false

  // 渲染图表
  await nextTick()
  renderChart(backtestResult.value.trades)
}

const saveBacktest = async () => {
  MessagePlugin.success('保存成功')
}

const loadBacktest = () => {
  MessagePlugin.success('加载成功')
}

const onRowClick = () => {
  MessagePlugin.success('点击了表格行')
}

// 渲染收益曲线图表（这里使用简单的模拟，实际项目中可以使用ECharts等图表库）
const renderChart = (data) => {
  if (!chartContainer.value || !backtestResult.value) return

  const chartInstance = echarts.init(chartContainer.value)

  const sortedData = data.filter((item) => item.type === '卖出')

  const option = {
    xAxis: {
      data: sortedData.map((item) => item.date),
      type: 'category',
      axisLabel: {
        interval: Math.floor(sortedData.length / 4),
        color: '#666',
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#333',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12,
      },
      formatter: function (params) {
        const data = params[0]
        return `
        <div style="font-weight:bold;margin-bottom:5px;">${data.axisValue}</div>
        <div style="display:flex;justify-content:space-between;">
          <span style="margin-right:20px;">盈利金额:</span>
          <span style="font-weight:bold;color:${data.data >= 0 ? '#e34d59' : '#00a870'}">${data.data} 元</span>
        </div>
      `
      },
    },
    yAxis: {
      name: '盈亏（人民币）',
      nameTextStyle: {
        color: '#666',
        padding: [0, 0, 0, 40],
      },
      axisLabel: {
        formatter: '{value}',
        color: '#666',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
      scale: true,
    },
    series: [
      {
        data: sortedData.map((item) => item.profit),
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: '#0052d9',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 82, 217, 0.4)' },
            { offset: 1, color: 'rgba(0, 82, 217, 0.1)' },
          ]),
        },
        emphasis: {
          lineStyle: {
            width: 4,
            color: '#0052d9',
          },
        },
        animationDuration: 2000,
        animationEasing: 'elasticOut',
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.backtest-container {
  padding: 16px;
  min-height: 100vh;
}

.header-card {
  margin-bottom: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-content h2 {
  margin: 0;
  margin-right: 15px;
}

.header-content .buttons {
  width: 19vw;
  display: flex;
  justify-content: space-between;
}

.config-card,
.params-card {
  margin-bottom: 16px;
}

.result-card,
.chart-card,
.trades-card {
  margin-bottom: 16px;
}

.chart-card {
  width: 100%;
}

.metric-item {
  text-align: center;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.metric-value.positive {
  color: #e34d59;
}

.metric-value.negative {
  color: #00a870;
}

.second-row {
  margin-top: 16px;
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.chart-container {
  height: 300px;
  width: 100%;
}

:deep(.t-card__header) {
  border-bottom: 1px solid #e6e6e6;
}

:deep(.t-card__body) {
  padding: 16px;
}

:deep(.t-form-item) {
  margin-bottom: 16px;
}

/* :deep(.t-table) {
  background: #fff;
} */
</style>
