<template>
  <t-card>
    <t-space direction="vertical">
      <header>
        <t-dropdown
          :options="CONSTANTS.DROPDOWN_OPTIONS"
          trigger="click"
          @click="onRankChange"
          min-column-width="7.5em"
          :disabled="disabled"
        >
          <t-space>
            <t-button variant="text" class="button">
              {{ tab }}
              <template #suffix>
                <ChevronDownIcon style="font-size: var(--td-font-size-headline-medium)"
              /></template>
            </t-button>
          </t-space>
        </t-dropdown>
        <t-select :defaultValue="t('pages.stock.countries.China.title')" v-on:change="onAreaChange">
          <t-option
            v-for="country in CONSTANTS.COUNTRIES"
            :key="country.value"
            :label="country.title"
            :value="country.value"
          />
        </t-select>
        <t-dialog
          :visible="visible"
          header="(°ー°〃)"
          :on-close="onClose"
          :on-overlay-click="onClose"
          :on-confirm="onClose"
          :on-esc-keydown="onClose"
          :on-cancel="onClose"
          top="5vh"
        >
          <p>{{ t('pages.stock.dropdown.part1') }}</p>
          <p>{{ t('pages.stock.dropdown.part2') }}</p>
          <img ref="img" alt="(°ー°〃)" width="100%" />
        </t-dialog>
      </header>
      <t-skeleton
        :loading="loading"
        animation="gradient"
        :rowCol="Array(22).fill({ width: '57.375em' })"
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
import colaImg from '@/assets/assets-cola.png'
import ideaImg from '@/assets/assets-idea.png'
import xiaoyanImg from '@/assets/assets-xiaoyan.png'
import moneyImg from '@/assets/assets-money.png'
import redImg from '@/assets/assets-red.png'
import { ref, onMounted, shallowRef } from 'vue'
import { MessagePlugin, TableProps } from 'tdesign-vue-next'

import { getDailyGainer, getDailyLoser } from '@/services/client'
import { t } from '@/infrastructure/locales'
import router from '@/router'
import { ChevronDownIcon } from 'tdesign-icons-vue-next'

const tab = ref(t('pages.stock.dropdown.up'))
const img = ref(null)
const loading = ref(true)
const disabled = ref(false)
const visible = ref(false)
const region = ref('CN')
const tableData = shallowRef<TableProps['data']>([])
const CONSTANTS = {
  COUNTRIES: [
    {
      title: t('pages.stock.countries.China.title'),
      value: t('pages.stock.countries.China.value'),
    },
    {
      title: t('pages.stock.countries.America.title'),
      value: t('pages.stock.countries.America.value'),
    },
    {
      title: t('pages.stock.countries.HongKong.title'),
      value: t('pages.stock.countries.HongKong.value'),
    },
    {
      title: t('pages.stock.countries.Taiwan.title'),
      value: t('pages.stock.countries.Taiwan.value'),
    },
    {
      title: t('pages.stock.countries.Japan.title'),
      value: t('pages.stock.countries.Japan.value'),
    },
    { title: t('pages.stock.countries.UK.title'), value: t('pages.stock.countries.UK.value') },
    {
      title: t('pages.stock.countries.Germany.title'),
      value: t('pages.stock.countries.Germany.value'),
    },
    {
      title: t('pages.stock.countries.India.title'),
      value: t('pages.stock.countries.India.value'),
    },
    {
      title: t('pages.stock.countries.Australia.title'),
      value: t('pages.stock.countries.Australia.value'),
    },
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
      width: 150,
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
      width: 60,
    },
    {
      colKey: 'lowPrice',
      title: t('pages.stock.columns.lowPrice'),
      ellipsis: true,
      width: 60,
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
    getDailyList(
      tab.value == t('pages.stock.dropdown.up') ? getDailyGainer : getDailyLoser,
      region.value,
    )
  }
}
const onRowClick = (data) => {
  MessagePlugin.success(t('pages.stock.dropdown.stockCode') + data.row.key)
  router.push('/analysis/technical')
}
const onClose = () => {
  visible.value = false
}
const getImg = () => {
  const images = [colaImg, ideaImg, xiaoyanImg, moneyImg, redImg]
  return images[Math.floor(Math.random() * images.length)]
}
const onAreaChange = (data) => {
  region.value = data
  if (region.value == 'CN' || region.value === 'US') {
    MessagePlugin.success(t('pages.stock.dropdown.toggleSuccess'))
    getDailyList(
      tab.value == t('pages.stock.dropdown.up') ? getDailyGainer : getDailyLoser,
      region.value,
    )
  } else {
    visible.value = true
    img.value.src = getImg()
    getDailyList(getDailyGainer, 'CN')
  }
}
function getDailyList(get, region) {
  loading.value = true
  disabled.value = true
  const result = []
  try {
    get(region).then((res) => {
      if (typeof res === 'object' && res !== null && 'quotes' in res && Array.isArray(res.quotes)) {
        const quotes = res.quotes
        for (let i of quotes) {
          result.push({
            key: i.symbol,
            name: i.shortName,
            volume: i.regularMarketVolume,
            change: i.regularMarketChange.toPrecision(4),
            changeAmount: i.regularMarketChangePercent.toPrecision(4),
            price: i.regularMarketPrice,
            highPrice: i.regularMarketDayHigh.toPrecision(4),
            lowPrice: i.regularMarketDayLow.toPrecision(4),
            closePrice: i.regularMarketPreviousClose,
          })
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
  getDailyList(getDailyGainer, region.value)
})
</script>
<style lang="less" scoped>
@import '../index.less';
</style>
