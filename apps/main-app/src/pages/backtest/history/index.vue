<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="backtest-history-container">
    <!-- 回测列表区域 -->
    <t-card class="list-card" :title="t('pages.backtest.history.title')" hover-shadow>
      <template #actions>
        <t-space>
          <t-radio-group v-model="sortType" variant="default-filled" @change="handleSortChange">
            <t-radio-button value="time">{{
              t('pages.backtest.history.sortByTime')
            }}</t-radio-button>
            <t-radio-button value="return">{{
              t('pages.backtest.history.sortByReturn')
            }}</t-radio-button>
          </t-radio-group>
        </t-space>
      </template>

      <t-table
        :data="displayRecords"
        :columns="columns as any"
        :hover="true"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        stripe
        row-key="id"
      >
        <template #date="{ row }">
          {{ formatDate(row.date) }}
        </template>
        <template #strategy="{ row }">
          <t-tag variant="light" theme="primary">{{ row.backtestConfig.strategy }}</t-tag>
        </template>
        <template #symbol="{ row }">
          {{ row.backtestConfig.symbol }}
        </template>
        <template #totalReturn="{ row }">
          <span :class="row.backtestResult.totalReturn >= 0 ? 'profit' : 'loss'">
            {{ formatPercent(row.backtestResult.totalReturn) }}
          </span>
        </template>
        <template #maxDrawdown="{ row }">
          <span>{{ formatPercent(row.backtestResult.maxDrawdown) }}</span>
        </template>
        <template #sharpeRatio="{ row }">
          {{ row.backtestResult.sharpeRatio.toFixed(2) }}
        </template>
        <template #winRate="{ row }">
          {{ formatPercent(row.backtestResult.winRate) }}
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-link @click.stop="viewDetail(row)">{{
              t('pages.backtest.history.viewDetail')
            }}</t-link>
            <t-popconfirm
              :content="t('pages.backtest.history.confirmDelete')"
              @confirm="confirmDelete(row)"
            >
              <t-link theme="danger" @click.stop="(e) => e.stopPropagation()">
                {{ t('pages.backtest.history.delete') }}
              </t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 详情弹窗 -->
    <t-dialog
      v-model:visible="detailVisible"
      :header="t('pages.backtest.history.detailTitle')"
      top="0"
      :width="500"
      :footer="false"
      attach="body"
    >
      <template v-if="currentRecord">
        <t-tabs default-value="basic">
          <t-tab-panel
            value="basic"
            :label="t('pages.backtest.history.basicInfo')"
            style="margin-top: 1.25rem"
          >
            <t-space direction="vertical" size="large" style="width: 100%">
              <t-row :gutter="[16, 16]">
                <t-col :span="12">
                  <t-descriptions
                    :title="t('pages.backtest.history.backtestConfig')"
                    layout="vertical"
                    colon
                  >
                    <t-descriptions-item :label="t('pages.backtest.history.backtestTime')">
                      {{ formatDate(currentRecord.date) }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.strategyName')">
                      {{ currentRecord.backtestConfig.strategy }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.stockCode')">
                      {{ currentRecord.backtestConfig.symbol }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.backtestRange')">
                      {{ currentRecord.backtestConfig.dateRange[0] }} 至
                      {{ currentRecord.backtestConfig.dateRange[1] }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.initialCapital')">
                      {{ formatMoney(currentRecord.backtestConfig.initialCapital) }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.commissionRate')">
                      {{ formatPercent(currentRecord.backtestConfig.commission) }}
                    </t-descriptions-item>
                  </t-descriptions>
                </t-col>
                <t-col :span="12">
                  <t-descriptions
                    :title="t('pages.backtest.history.backtestResult')"
                    layout="vertical"
                    colon
                  >
                    <t-descriptions-item :label="t('pages.backtest.history.totalReturn')">
                      <span
                        :class="currentRecord.backtestResult.totalReturn >= 0 ? 'profit' : 'loss'"
                      >
                        {{ formatPercent(currentRecord.backtestResult.totalReturn) }}
                      </span>
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.annualReturn')">
                      <span
                        :class="currentRecord.backtestResult.annualReturn >= 0 ? 'profit' : 'loss'"
                      >
                        {{ formatPercent(currentRecord.backtestResult.annualReturn) }}
                      </span>
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.maxDrawdown')">
                      <span class="loss">
                        {{ formatPercent(currentRecord.backtestResult.maxDrawdown) }}
                      </span>
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.sharpeRatio')">
                      {{ currentRecord.backtestResult.sharpeRatio.toFixed(2) }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.totalTrades')">
                      {{ currentRecord.backtestResult.totalTrades }}
                    </t-descriptions-item>
                    <t-descriptions-item :label="t('pages.backtest.history.winRate')">
                      {{ formatPercent(currentRecord.backtestResult.winRate) }}
                    </t-descriptions-item>
                  </t-descriptions>
                </t-col>
              </t-row>

              <t-divider></t-divider>

              <t-descriptions
                :title="t('pages.backtest.history.strategyParams')"
                :column="3"
                layout="vertical"
                colon
              >
                <template v-for="(value, key) in currentRecord.strategyParams" :key="key">
                  <t-descriptions-item :label="formatParamName(key)">
                    {{ value }}
                  </t-descriptions-item>
                </template>
              </t-descriptions>
            </t-space>
          </t-tab-panel>

          <t-tab-panel
            value="analysis"
            :label="t('pages.backtest.history.riskAnalysis')"
            style="margin-top: 1.25rem"
          >
            <t-space direction="vertical" size="large" style="width: 100%">
              <t-descriptions
                :title="t('pages.backtest.history.riskMetrics')"
                :column="4"
                layout="vertical"
                colon
              >
                <t-descriptions-item :label="t('pages.backtest.history.volatility')">
                  <span class="loss">
                    {{ formatPercent(currentRecord.backtestResult.volatility) }}
                  </span>
                </t-descriptions-item>
                <t-descriptions-item :label="t('pages.backtest.history.betaCoefficient')">
                  {{ currentRecord.backtestResult.Beta.toFixed(2) }}
                </t-descriptions-item>
                <t-descriptions-item :label="t('pages.backtest.history.holdingPeriod')">
                  {{ currentRecord.backtestResult.positionPeriod
                  }}{{ t('pages.backtest.history.days') }}
                </t-descriptions-item>
                <t-descriptions-item :label="t('pages.backtest.history.positionUtilization')">
                  {{ formatPercent(currentRecord.backtestResult.positionUtilizationRate) }}
                </t-descriptions-item>
              </t-descriptions>
            </t-space>
          </t-tab-panel>
        </t-tabs>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { MessagePlugin } from 'tdesign-vue-next'

import { backtestStorage } from '@/infrastructure/utils'
import { t } from '@/infrastructure/locales'

// 定义表格列
const columns = [
  { colKey: 'date', title: t('pages.backtest.history.backtestTime'), width: 160 },
  { colKey: 'strategy', title: t('pages.backtest.history.strategyName'), width: 120 },
  { colKey: 'symbol', title: t('pages.backtest.history.stockCode'), width: 100 },
  {
    colKey: 'totalReturn',
    title: t('pages.backtest.history.totalReturn'),
    width: 110,
    sorter: true,
  },
  { colKey: 'maxDrawdown', title: t('pages.backtest.history.maxDrawdown'), width: 100 },
  { colKey: 'sharpeRatio', title: t('pages.backtest.history.sharpeRatio'), width: 100 },
  { colKey: 'winRate', title: t('pages.backtest.history.winRate'), width: 100 },
  { colKey: 'operation', title: t('pages.backtest.history.action'), width: 120 },
]

// 状态变量
const allRecords = ref([])
const displayRecords = ref([])
const loading = ref(true)
const filterParams = ref({
  dateRange: null,
  strategy: null,
  symbol: null,
})
const sortType = ref('time')
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})
const detailVisible = ref(false)
const currentRecord = ref(null)
const chartInstance = ref(null)
const recordToDelete = ref(null)

// 格式化函数
const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr)
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  } catch (e) {
    console.error(e)
    return dateStr
  }
}

const formatPercent = (value) => {
  return (value * 100).toFixed(2) + '%'
}

const formatMoney = (value) => {
  return value.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
}

const formatParamName = (key) => {
  const nameMap = {
    holdingPeriod: t('pages.backtest.history.holdingPeriod'),
    shareHoldingLimit: t('pages.backtest.history.shareHoldingLimit'),
    profitHoldThreshold: t('pages.backtest.history.profitHoldThreshold'),
    trailingStopPercent: t('pages.backtest.history.trailingStopPercent'),
    stopLossLimit: t('pages.backtest.history.stopLossLimit'),
    shortPeriod: t('pages.backtest.history.shortPeriod'),
    longPeriod: t('pages.backtest.history.longPeriod'),
    rsiPeriod: t('pages.backtest.history.rsiPeriod'),
    overbought: t('pages.backtest.history.overbought'),
    oversold: t('pages.backtest.history.oversold'),
    bollingerBandsPeriod: t('pages.backtest.history.bollingerBandsPeriod'),
    standardDeviationMultiple: t('pages.backtest.history.standardDeviationMultiple'),
  }
  return nameMap[key] || key
}

async function queryBacktestRecords() {
  loading.value = true
  try {
    const records = await backtestStorage.getAllBacktestRecords()
    allRecords.value = records || []
    applyFiltersAndSort()
  } catch (error) {
    console.error(t('pages.backtest.history.queryError'), error)
    MessagePlugin.error(t('pages.backtest.history.queryFailed'))
  } finally {
    loading.value = false
  }
}

function applyFiltersAndSort() {
  let filtered = [...allRecords.value]

  // 应用日期筛选
  if (filterParams.value.dateRange && filterParams.value.dateRange.length === 2) {
    const startDate = new Date(filterParams.value.dateRange[0]).getTime()
    const endDate = new Date(filterParams.value.dateRange[1]).getTime()
    filtered = filtered.filter((record) => {
      const recordDate = new Date(record.date).getTime()
      return recordDate >= startDate && recordDate <= endDate
    })
  }

  // 应用策略筛选
  if (filterParams.value.strategy) {
    filtered = filtered.filter(
      (record) => record.backtestConfig.strategy === filterParams.value.strategy,
    )
  }

  // 应用股票代码筛选
  if (filterParams.value.symbol) {
    filtered = filtered.filter(
      (record) => record.backtestConfig.symbol === filterParams.value.symbol,
    )
  }

  // 应用排序
  if (sortType.value === 'return') {
    filtered.sort((a, b) => b.backtestResult.totalReturn - a.backtestResult.totalReturn)
  } else {
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // 更新分页信息
  pagination.value.total = filtered.length
  pagination.value.current = 1

  // 更新显示记录
  updateDisplayRecords(filtered)
}

function updateDisplayRecords(filtered) {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  displayRecords.value = filtered.slice(start, end)
}

function handleSortChange() {
  applyFiltersAndSort()
}

function onPageChange(pageInfo) {
  pagination.value.current = pageInfo.current
  const start = (pageInfo.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  displayRecords.value = allRecords.value.slice(start, end)
}

function viewDetail(row) {
  currentRecord.value = row
  detailVisible.value = true
}

function confirmDelete(row) {
  recordToDelete.value = row
  deleteRecord(row.id)
}

async function deleteRecord(id) {
  loading.value = true
  try {
    await backtestStorage.deleteBacktestRecord(id)
    MessagePlugin.success(t('pages.backtest.history.deleteSuccess'))
    await queryBacktestRecords()
  } catch (error) {
    console.error(t('pages.backtest.history.deleteError'), error)
    MessagePlugin.error(t('pages.backtest.history.deleteFailed'))
  } finally {
    loading.value = false
  }
}

watch(detailVisible, (newVal) => {
  if (!newVal && chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})

onMounted(async () => {
  try {
    await backtestStorage.init()
    await queryBacktestRecords()
  } catch (error) {
    console.error(t('pages.backtest.history.initError'), error)
    MessagePlugin.error(t('pages.backtest.history.initFailed'))
  }
})

onBeforeUnmount(() => {
  backtestStorage.close()
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
})
</script>

<style scoped>
.backtest-history-container {
  padding: 1.25rem;
}

.filter-card {
  margin-bottom: 1.25rem;
}

.list-card {
  margin-bottom: 1.25rem;
}

.profit {
  color: #2ba471;
  font-weight: bold;
}

.loss {
  color: #d54941;
  font-weight: bold;
}

:deep(.t-table__row) {
  cursor: pointer;
}
</style>
