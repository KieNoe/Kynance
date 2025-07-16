<template>
  <t-card>
    <t-space direction="vertical">
      <header>
        <t-dropdown
          :options="[
            {
              content: '涨幅榜',
              value: 'up',
            },
            {
              content: '跌幅榜',
              value: 'down',
            },
          ]"
          trigger="click"
          @click="onRankChange"
          min-column-width="120px"
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
        <t-select defaultValue="中国大陆" v-on:change="onAreaChange">
          <t-option key="中国大陆" label="中国大陆" value="中国大陆" />
          <t-option key="美国" label="美国" value="美国" />
          <t-option key="香港" label="香港" value="香港" />
          <t-option key="台湾" label="香港" value="香港" />
          <t-option key="日本" label="日本" value="日本" />
          <t-option key="英国" label="英国" value="英国" />
          <t-option key="德国" label="德国" value="德国" />
          <t-option key="印度" label="印度" value="印度" />
          <t-option key="澳大利亚" label="澳大利亚" value="澳大利亚" />
        </t-select>
      </header>
      <!-- v-model:activeRowKeys 父组件控制高亮行 -->
      <!-- defaultActiveRowKeys 组件内部控制高亮行，父组件无法使用这个属性控制 -->
      <transition name="fade" mode="out-in">
        <t-skeleton
          :loading="loading"
          animation="gradient"
          :rowCol="Array(22).fill({ width: '918px' })"
        >
          <t-table
            row-key="key"
            :data="tableData"
            :columns="columns"
            :hover="true"
            :onRowClick="onRowClick"
            v-if="tableData.length > 0"
          ></t-table>
        </t-skeleton>
      </transition> </t-space
  ></t-card>
</template>

<script lang="tsx">
export default {
  name: 'HighlightTable',
}
</script>

<script lang="tsx" setup>
import { ref, onMounted, reactive } from 'vue'
import { MessagePlugin, TableProps } from 'tdesign-vue-next'

import { getDailyGainer, getDailyLoser } from '@/services/client'
import { t } from '@/infrastructure/locales'

const tab = ref('涨幅榜')
const loading = ref(true)
const tableData = reactive<TableProps['data']>([])

const columns = [
  {
    colKey: 'name',
    title: '股票名称',
    ellipsis: true,
    width: 130,
  },
  {
    colKey: 'price',
    title: '现价',
    ellipsis: true,
    width: 80,
  },
  {
    colKey: 'change',
    title: '涨跌幅',
    ellipsis: true,
    width: 80,
  },
  {
    colKey: 'changeAmount',
    title: '涨跌额',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'volume',
    title: '交易量',
    width: 100,
  },
  {
    colKey: 'highPrice',
    title: '最高价',
    ellipsis: true,
    width: 80,
  },
  {
    colKey: 'lowPrice',
    title: '最低价',
    ellipsis: true,
    width: 80,
  },
  {
    colKey: 'closePrice',
    title: '前收盘价',
    width: 80,
    ellipsis: true,
  },
]
const onRankChange = (data) => {
  MessagePlugin.success(`选中【${data.content}】`)
  tab.value = data.content
}
const onRowClick = () => {
  MessagePlugin.success('点击行')
}
const onAreaChange = () => {
  MessagePlugin.success('切换地区')
}
onMounted(() => {
  const result = []
  getDailyGainer().then((res) => {
    if (typeof res === 'object' && res !== null && 'quotes' in res && Array.isArray(res.quotes)) {
      const quotes = res.quotes
      for (let i of quotes) {
        result.push(
          {
            name: i.displayName,
            volume: i.regularMarketVolume,
            change: i.regularMarketChange,
            changeAmount: i.regularMarketChangePercent,
            price: i.regularMarketPrice,
            highPrice: i.regularMarketDayHigh,
            lowPrice: i.regularMarketDayLow,
            closePrice: i.regularMarketPreviousClose,
          },
          {
            name: i.displayName,
            volume: i.regularMarketVolume,
            change: i.regularMarketChange,
            changeAmount: i.regularMarketChangePercent,
            price: i.regularMarketPrice,
            highPrice: i.regularMarketDayHigh,
            lowPrice: i.regularMarketDayLow,
            closePrice: i.regularMarketPreviousClose,
          },
        )
      }
      tableData.push(...result)
      loading.value = false
    }
  })
})
</script>
<style lang="less" scoped>
@import '../index.less';
</style>
