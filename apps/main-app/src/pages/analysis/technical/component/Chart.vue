<template>
  <div id="chartContainer" class="card">
    <header>
      <t-dropdown
        v-for="(item, key) in OPTIONS.dropdownItems"
        :key="key"
        class="dropdown"
        :options="OPTIONS[key]"
        trigger="click"
        :disabled="disabled"
        :min-column-width="65"
        @click="
          async (data) => {
            disabled = true
            MessagePlugin.success('已选择' + data.content + '技术曲线')
            ;(value as Record<string, any>)[key as string] = data.content
            switch (key) {
              case 'date':
                try {
                  const res = await getDayData('0700', data.value)
                  changeCharts([mainChart], getStockChartOptions(res, props.companyInfo.currency))
                } catch (err) {
                  MessagePlugin.error('获取数据失败')
                  console.log(err)
                }
                break
              case 'shock':
                break
              case 'volume':
                break
              case 'trending':
                break
            }
            disabled = false
          }
        "
      >
        <t-space>
          <t-button variant="text">
            {{ value[key] }}
            <template #suffix> <t-icon name="chevron-down" size="16" /></template>
          </t-button>
        </t-space>
      </t-dropdown>
      <t-select
        v-model="stock"
        :options="stockOptions"
        placeholder="请选择股票"
        style="max-width: 25vw; display: inline-block"
      >
        <template #panelTopContent>
          <div style="padding: 6px 6px 0 6px">
            <t-input
              v-model="search"
              placeholder="搜索(支持中英文名称，地区，代码)"
              @change="onSearch"
            />
          </div>
        </template>
      </t-select>
    </header>
    <div id="mainChart" style="width: 56.7vw; height: 60vh"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowReactive, shallowRef } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getStockChartOptions, changeCharts } from '@kynance/chart-core'

import { initChart } from '@/infrastructure/hook'
import { getDayData } from '@/services/client'
const props = defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})
let mainChart
const disabled = shallowRef(false)
const search = shallowRef('')
const stock = shallowRef('腾讯控股(Tencent)')

const value = shallowReactive({
  date: '1天',
  trending: 'MA(5)',
  shock: 'RSI',
  volume: 'OBV',
})

const OPTIONS = {
  dropdownItems: {
    date: '日期',
    trending: '趋势',
    shock: '震荡',
    volume: '成交量',
  },
  date: [
    { content: '1天', value: '1d' },
    { content: '10天', value: '10d' },
    { content: '1个月', value: '1m' },
    { content: '6个月', value: '6m' },
    { content: '1年', value: '1y' },
  ],
  trending: [
    { content: 'MA(5)', value: 'MA' },
    { content: 'MA(20)', value: 'MA' },
    { content: 'MACD', value: 'MACD' },
    { content: '布林带', value: '布林带' },
  ],
  shock: [
    { content: 'RSI', value: 'RSI' },
    { content: 'KDJ', value: 'KDJ' },
    { content: 'CCI', value: 'CCI' },
  ],
  volume: [
    { content: 'OBV', value: 'OBV' },
    { content: 'VWAP', value: 'VWAP' },
    { content: '量比', value: '量比' },
  ],
  momentum: [
    { content: 'DMI', value: 'DMI' },
    { content: 'ATR', value: 'ATR' },
    { content: '威廉指标', value: '威廉指标' },
  ],
  stock: [
    {
      label: '腾讯控股(Tencent)',
      value: '0700',
      title: '腾讯控股 (Tencent, 中国大陆, China, HK:0700)',
    },
    {
      label: '阿里巴巴(Alibaba)',
      value: 'BABA',
      title: '阿里巴巴 (Alibaba, 中国大陆, China, NYSE:BABA)',
    },
    {
      label: '贵州茅台(Moutai)',
      value: '600519',
      title: '贵州茅台 (Moutai, 中国大陆, China, SH:600519)',
    },
    { label: '美团(Meituan)', value: '3690', title: '美团 (Meituan, 中国大陆, China, HK:3690)' },
    { label: '京东(JD.com)', value: '9618', title: '京东 (JD.com, 中国大陆, China, HK:9618)' },
    {
      label: '拼多多(Pinduoduo)',
      value: 'PDD',
      title: '拼多多 (Pinduoduo, 中国大陆, China, NASDAQ:PDD)',
    },
    { label: '比亚迪(BYD)', value: '002594', title: '比亚迪 (BYD, 中国大陆, China, SZ:002594)' },
    {
      label: '宁德时代(CATL)',
      value: '300750',
      title: '宁德时代 (CATL, 中国大陆, China, SZ:300750)',
    },
    {
      label: '小米集团(Xiaomi)',
      value: '1810',
      title: '小米集团 (Xiaomi, 中国大陆, China, HK:1810)',
    },
    {
      label: '中国平安(Ping An)',
      value: '601318',
      title: '中国平安 (Ping An, 中国大陆, China, SH:601318)',
    },
    {
      label: '招商银行(CMB)',
      value: '600036',
      title: '招商银行 (CMB, 中国大陆, China, SH:600036)',
    },
    {
      label: '药明康德(WuXi AppTec)',
      value: '603259',
      title: '药明康德 (WuXi AppTec, 中国大陆, China, SH:603259)',
    },
    {
      label: '隆基绿能(LONGi)',
      value: '601012',
      title: '隆基绿能 (LONGi, 中国大陆, China, SH:601012)',
    },
    {
      label: '海康威视(Hikvision)',
      value: '002415',
      title: '海康威视 (Hikvision, 中国大陆, China, SZ:002415)',
    },
    {
      label: '伊利股份(Yili)',
      value: '600887',
      title: '伊利股份 (Yili, 中国大陆, China, SH:600887)',
    },
    { label: '苹果 (Apple)', value: 'AAPL', title: '苹果 (Apple, 美国, America, NASDAQ:AAPL)' },
    {
      label: '微软 (Microsoft)',
      value: 'MSFT',
      title: '微软 (Microsoft, 美国, America, NASDAQ:MSFT)',
    },
    {
      label: '谷歌 (Alphabet)',
      value: 'GOOGL',
      title: '谷歌 (Alphabet, 美国, America, NASDAQ:GOOGL)',
    },
    {
      label: '亚马逊 (Amazon)',
      value: 'AMZN',
      title: '亚马逊 (Amazon, 美国, America, NASDAQ:AMZN)',
    },
    {
      label: '特斯拉 (Tesla)',
      value: 'TSLA',
      title: '特斯拉 (Tesla, 美国, America, NASDAQ:TSLA)',
    },
    {
      label: '英伟达 (NVIDIA)',
      value: 'NVDA',
      title: '英伟达 (NVIDIA, 美国, America, NASDAQ:NVDA)',
    },
    {
      label: 'Meta (Facebook)',
      value: 'META',
      title: 'Meta (Facebook, 美国, America, NASDAQ:META)',
    },
    {
      label: '伯克希尔·哈撒韦 (Berkshire Hathaway)',
      value: 'BRK.A',
      title: '伯克希尔·哈撒韦 (Berkshire Hathaway, 美国, America, NYSE:BRK.A)',
    },
    {
      label: '摩根大通 (JPMorgan Chase)',
      value: 'JPM',
      title: '摩根大通 (JPMorgan Chase, 美国, America, NYSE:JPM)',
    },
    {
      label: '强生 (Johnson & Johnson)',
      value: 'JNJ',
      title: '强生 (Johnson & Johnson, 美国, America, NYSE:JNJ)',
    },
    {
      label: '沃尔玛 (Walmart)',
      value: 'WMT',
      title: '沃尔玛 (Walmart, 美国, America, NYSE:WMT)',
    },
    {
      label: '宝洁 (Procter & Gamble)',
      value: 'PG',
      title: '宝洁 (Procter & Gamble, 美国, America, NYSE:PG)',
    },
    {
      label: '埃克森美孚 (ExxonMobil)',
      value: 'XOM',
      title: '埃克森美孚 (ExxonMobil, 美国, America, NYSE:XOM)',
    },
    {
      label: '可口可乐 (Coca-Cola)',
      value: 'KO',
      title: '可口可乐 (Coca-Cola, 美国, America, NYSE:KO)',
    },
    { label: '辉瑞 (Pfizer)', value: 'PFE', title: '辉瑞 (Pfizer, 美国, America, NYSE:PFE)' },
    {
      label: '雀巢 (Nestlé)',
      value: 'NESN',
      title: '雀巢 (Nestlé, 瑞士, Switzerland, SWX:NESN)',
    },
    { label: '路威酩轩 (LVMH)', value: 'MC', title: '路威酩轩 (LVMH, 法国, France, EPA:MC)' },
    { label: '阿斯麦 (ASML)', value: 'ASML', title: '阿斯麦 (ASML, 荷兰, Netherlands, AMS:ASML)' },
    {
      label: '西门子 (Siemens)',
      value: 'SIE',
      title: '西门子 (Siemens, 德国, Germany, ETR:SIE)',
    },
    { label: 'SAP ', value: 'SAP', title: 'SAP (SAP, 德国, Germany, ETR:SAP)' },
    {
      label: '三星电子 (Samsung)',
      value: '005930',
      title: '三星电子 (Samsung, 韩国, South Korea, KRX:005930)',
    },
    {
      label: '丰田汽车 (Toyota)',
      value: '7203',
      title: '丰田汽车 (Toyota, 日本, Japan, TYO:7203)',
    },
    { label: '索尼 (Sony)', value: '6758', title: '索尼 (Sony, 日本, Japan, TYO:6758)' },
    {
      label: '台积电 (TSMC)',
      value: '2330',
      title: '台积电 (TSMC, 中国台湾, Taiwan, TPE:2330)',
    },
    {
      label: '信实工业 (Reliance)',
      value: 'RELIANCE',
      title: '信实工业 (Reliance, 印度, India, NSE:RELIANCE)',
    },
    {
      label: '必和必拓 (BHP)',
      value: 'BHP',
      title: '必和必拓 (BHP, 澳大利亚, Australia, ASX:BHP)',
    },
    { label: '淡水河谷 (Vale)', value: 'VALE', title: '淡水河谷 (Vale, 巴西, Brazil, NYSE:VALE)' },
    {
      label: '沙特阿美 (Saudi Aramco)',
      value: '2222',
      title: '沙特阿美 (Saudi Aramco, 沙特, Saudi Arabia, TADAWUL:2222)',
    },
  ],
}

const stockOptions = shallowRef(OPTIONS.stock)
const onSearch = () => {
  stockOptions.value = OPTIONS.stock.filter((item) => item.title.indexOf(search.value) !== -1)
}
onMounted(async () => {
  const res = await getDayData('0700', '1d')
  mainChart = await initChart(
    'mainChart',
    mainChart,
    getStockChartOptions(res, props.companyInfo.currency),
    onUnmounted,
  )
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
