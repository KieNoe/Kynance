<template>
  <t-card>
    <t-space direction="vertical">
      <header>
        <t-dropdown min-column-width="120px">
          <t-space>
            <t-button variant="text" class="button">
              {{ t('pages.stock.recommend.title') }}
            </t-button>
          </t-space>
        </t-dropdown>
      </header>
      <t-table
        row-key="key"
        :data="tableData"
        :columns="CONSTANTS.COLUMNS"
        :hover="true"
        :onRowClick="onRowClick"
        v-if="tableData.length > 0"
      ></t-table></t-space
  ></t-card>
</template>

<script lang="tsx" setup>
import { shallowRef } from 'vue'
import { MessagePlugin, TableProps } from 'tdesign-vue-next'

import { t } from '@/infrastructure/locales'
import router from '@/router'

const tableData = shallowRef<TableProps['data']>([
  {
    key: 'HKG: 0700',
    name: t('pages.stock.recommend.Tencent'),
    price: '$517.50',
    change: '+0.19%',
    changeAmount: '+1.03',
    volume: '1,674.91',
    highPrice: '$519.50',
    lowPrice: '$513.26',
    closePrice: '$514.85',
    raise: 'up',
  },
  {
    key: 'HKG: 3988',
    name: t('pages.stock.recommend.Bank'),
    price: '$4.66',
    change: '+0.85%',
    changeAmount: '+0.04',
    volume: '18,683.25',
    highPrice: '$4.68',
    lowPrice: '$4.64',
    closePrice: '$4.64',
    raise: 'up',
  },
  {
    key: '2330.TW',
    name: t('pages.stock.recommend.TSMC'),
    price: '$26.55',
    change: '+0.57%',
    changeAmount: '+0.15',
    volume: '545.00',
    highPrice: '$26.68',
    lowPrice: '$26.24',
    closePrice: '$26.45',
    raise: 'up',
  },
  {
    key: 'GOOGL',
    name: t('pages.stock.recommend.Google'),
    price: '$183.77',
    change: '-0.37%',
    changeAmount: '-0.67',
    volume: '2,697.24',
    highPrice: '$185.34',
    lowPrice: '$183.08',
    closePrice: '$183.10',
    raise: 'down',
  },
  {
    key: 'AAPL',
    name: t('pages.stock.recommend.Apple'),
    price: '$210.16',
    change: '+0.19%',
    changeAmount: '+1.03',
    volume: '5,297.88',
    highPrice: '$212.40',
    lowPrice: '$208.64',
    closePrice: '$209.11',
    raise: 'up',
  },
  {
    key: 'MSFT',
    name: t('pages.stock.recommend.Microsoft'),
    price: '$223.19',
    change: '-1.40%',
    changeAmount: '-3.16',
    volume: '4,141.79',
    highPrice: '$226.10',
    lowPrice: '$222.18',
    closePrice: '$226.35',
    raise: 'down',
  },
  {
    key: 'ORCL',
    name: t('pages.stock.recommend.Oracle'),
    price: '$241.30',
    change: '+2.70%',
    changeAmount: '+6.34',
    volume: '1,696.04',
    highPrice: '$241.33',
    lowPrice: '$233.19',
    closePrice: '$234.96',
    raise: 'up',
  },
  {
    key: 'MSFT',
    name: t('pages.stock.recommend.Microsoft'),
    price: '$505.62',
    change: '-0.04%',
    changeAmount: '-0.20',
    volume: '1,853.20',
    highPrice: '$506.72',
    lowPrice: '$501.89',
    closePrice: '$505.82',
    raise: 'down',
  },
  {
    key: 'META',
    name: t('pages.stock.recommend.Facebook'),
    price: '$517.50',
    change: '-1.05%',
    changeAmount: '-7.48',
    volume: '1,186.91',
    highPrice: '$713.97',
    lowPrice: '$699.27',
    closePrice: '$710.39',
    raise: 'down',
  },
  {
    key: 'NVDA',
    name: t('pages.stock.recommend.NVIDIA'),
    price: '$171.37',
    change: '+0.39%',
    changeAmount: '+0.67',
    volume: '18,545.26',
    highPrice: '$171.75',
    lowPrice: '$168.90',
    closePrice: '$170.70',
    raise: 'up',
  },
])
const CONSTANTS = {
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
      width: 80,
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
                  {row.change}
                </span>
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
                  {row.changeAmount}
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
const onRowClick = (data) => {
  MessagePlugin.success(t('pages.stock.recommend.stockCode') + data.row.key)
  router.push('/analysis/technical')
}
</script>
<style lang="less" scoped>
@import '../index.less';
</style>
