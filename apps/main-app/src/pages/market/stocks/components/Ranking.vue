<template>
  <t-card>
    <t-space direction="vertical">
      <header>
        <t-dropdown
          :options="CONSTANTS.DROPDOWN_OPTIONS"
          trigger="click"
          @click="onRankChange"
          min-column-width="120px"
          :disabled="disabled"
        >
          <t-space>
            <t-button variant="text" class="button">
              {{ tab }}
              <template #suffix>
                <t-icon name="chevron-down" style="font-size: var(--td-font-size-headline-medium)"
              /></template>
            </t-button>
          </t-space>
        </t-dropdown>
        <t-select :defaultValue="t('pages.stock.countries.China')" v-on:change="onAreaChange">
          <t-option
            v-for="country in CONSTANTS.COUNTRIES"
            :key="country"
            :label="country"
            :value="country"
          />
        </t-select>
      </header>
      <t-skeleton
        :loading="loading"
        animation="gradient"
        :rowCol="Array(22).fill({ width: '918px' })"
      >
        <t-table
          row-key="key"
          :data="tableData"
          :columns="CONSTANTS.COLUMNS"
          :hover="true"
          :onRowClick="onRowClick"
          v-if="tableData.length > 0"
        ></t-table> </t-skeleton></t-space
  ></t-card>
</template>

<script lang="tsx" setup>
import { ref, onMounted, shallowRef } from 'vue'
import { MessagePlugin, TableProps } from 'tdesign-vue-next'

import { getDailyGainer, getDailyLoser } from '@/services/client'
import { t } from '@/infrastructure/locales'

const tab = ref(t('pages.stock.dropdown.up'))
const loading = ref(true)
const disabled = ref(false)
const tableData = shallowRef<TableProps['data']>([])
const CONSTANTS = {
  COUNTRIES: [
    t('pages.stock.countries.China'),
    t('pages.stock.countries.America'),
    t('pages.stock.countries.HongKong'),
    t('pages.stock.countries.Taiwan'),
    t('pages.stock.countries.Japan'),
    t('pages.stock.countries.UK'),
    t('pages.stock.countries.Germany'),
    t('pages.stock.countries.India'),
    t('pages.stock.countries.Australia'),
  ],
  DROPDOWN_OPTIONS: [
    {
      content: t('pages.stock.dropdown.up'),
      value: 'up',
    },
    {
      content: t('pages.stock.dropdown.down'),
      value: 'down',
    },
  ],
  COLUMNS: [
    {
      colKey: 'name',
      title: t('pages.stock.columns.name'),
      ellipsis: true,
      width: 130,
    },
    {
      colKey: 'price',
      title: t('pages.stock.columns.price'),
      ellipsis: true,
      width: 60,
    },
    {
      colKey: 'change',
      title: t('pages.stock.columns.change'),
      ellipsis: true,
      width: 80,
      cell: (h, { row }) => {
        return (
          <div class="t-statistic">
            <div>
              <div
                class="t-statistic-content"
                style={
                  row.changeAmount > 0
                    ? { color: 'var(--td-error-color)' }
                    : { color: 'var(--td-success-color)' }
                }
              >
                <span class="t-statistic-content-value" style="font-size: 1.3em !important">
                  {row.changeAmount > 0 ? '+' + row.change : row.change}
                </span>
                <span class="t-statistic-content-unit">%</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      colKey: 'changeAmount',
      title: t('pages.stock.columns.changeAmount'),
      ellipsis: true,
      width: 80,
      cell: (h, { row }) => {
        return (
          <div class="t-statistic">
            <div>
              <div
                class="t-statistic-content"
                style={
                  row.changeAmount > 0
                    ? { color: 'var(--td-error-color)' }
                    : { color: 'var(--td-success-color)' }
                }
              >
                <span class="t-statistic-content-value" style="font-size: 1.3em !important">
                  {row.changeAmount > 0 ? '+' + row.changeAmount : row.changeAmount}
                </span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      colKey: 'volume',
      title: t('pages.stock.columns.volume'),
      width: 90,
    },
    {
      colKey: 'highPrice',
      title: t('pages.stock.columns.highPrice'),
      ellipsis: true,
      width: 80,
    },
    {
      colKey: 'lowPrice',
      title: t('pages.stock.columns.lowPrice'),
      ellipsis: true,
      width: 80,
    },
    {
      colKey: 'closePrice',
      title: t('pages.stock.columns.closePrice'),
      width: 80,
      ellipsis: true,
    },
  ],
}
const onRankChange = (data) => {
  if (tab.value != data.content) {
    tab.value = data.content
    getDailyList(tab.value == t('pages.stock.dropdown.up') ? getDailyGainer : getDailyLoser)
  }
}
const onRowClick = (data) => {
  MessagePlugin.success('股票代码' + data.row.key)
}
const onAreaChange = () => {
  MessagePlugin.success('切换地区')
}
function getDailyList(get) {
  loading.value = true
  disabled.value = true
  const result = []
  try {
    get().then((res) => {
      if (typeof res === 'object' && res !== null && 'quotes' in res && Array.isArray(res.quotes)) {
        const quotes = res.quotes
        for (let i of quotes) {
          result.push(
            {
              key: i.symbol,
              name: i.shortName,
              volume: i.regularMarketVolume,
              change: i.regularMarketChange.toPrecision(4),
              changeAmount: i.regularMarketChangePercent.toPrecision(4),
              price: i.regularMarketPrice,
              highPrice: i.regularMarketDayHigh.toPrecision(4),
              lowPrice: i.regularMarketDayLow.toPrecision(4),
              closePrice: i.regularMarketPreviousClose,
            },
            {
              key: i.symbol,
              name: i.shortName,
              volume: i.regularMarketVolume,
              change: i.regularMarketChange.toPrecision(4),
              changeAmount: i.regularMarketChangePercent.toPrecision(4),
              price: i.regularMarketPrice,
              highPrice: i.regularMarketDayHigh.toPrecision(4),
              lowPrice: i.regularMarketDayLow.toPrecision(4),
              closePrice: i.regularMarketPreviousClose,
            },
          )
        }
        tableData.value.splice(0, tableData.value.length)
        tableData.value.push(...result)
        loading.value = false
        disabled.value = false
      }
    })
  } catch {
    MessagePlugin.error(t('pages.stock.error'))
  }
}
onMounted(() => {
  getDailyList(getDailyGainer)
})
</script>
<style lang="less" scoped>
@import '../index.less';
</style>
