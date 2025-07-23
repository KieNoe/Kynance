<template>
  <div id="chartContainer" class="card">
    <header>
      <t-dropdown
        v-for="(item, key) in OPTIONS.dropdownItems"
        :key="key"
        class="dropdown"
        :options="OPTIONS[key]"
        trigger="click"
        :min-column-width="65"
        @click="
          (data) => {
            MessagePlugin.success('已选择' + data.content)
            ;(value as Record<string, any>)[key as string] = data.content
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
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { initChart } from '@/infrastructure/hook'

const props = defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})

let mainChart
const search = ref('')
const stock = ref('腾讯控股(Tencent)')

function formatNumberToWan(num) {
  if (num >= 10000) {
    const intPart = Math.floor(num).toLocaleString('en-US')
    return num % 10000 === 0 ? `${(num / 10000).toLocaleString('en-US')}万` : `${intPart}万`
  } else {
    return num.toLocaleString('en-US')
  }
}

const value = reactive({
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
    { content: '1天', value: 1 },
    { content: '5天', value: 2 },
    { content: '1个月', value: 3 },
    { content: '6个月', value: 4 },
    { content: '1年', value: 5 },
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
    { content: '委比', value: '委比' },
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

const stockData = {
  symbol: '0700',
  data: [
    { date: '2025-06-23', open: 480.2, high: 485.8, low: 478.5, close: 484.1, volume: 18200000 },
    { date: '2025-06-24', open: 484.3, high: 490.5, low: 483.0, close: 489.2, volume: 19500000 },
    { date: '2025-06-25', open: 489.5, high: 492.0, low: 487.8, close: 490.1, volume: 17800000 },
    { date: '2025-06-26', open: 490.3, high: 493.2, low: 488.5, close: 491.5, volume: 16500000 },
    { date: '2025-06-27', open: 491.8, high: 494.0, low: 490.0, close: 492.2, volume: 15800000 },
    { date: '2025-06-28', open: 492.0, high: 492.5, low: 485.0, close: 487.3, volume: 20100000 },
    { date: '2025-06-29', open: 487.0, high: 488.2, low: 480.5, close: 482.1, volume: 21400000 },
    { date: '2025-06-30', open: 481.8, high: 484.0, low: 479.2, close: 480.5, volume: 19800000 },
    { date: '2025-07-01', open: 480.3, high: 482.5, low: 477.0, close: 478.8, volume: 18500000 },
    { date: '2025-07-02', open: 478.5, high: 479.0, low: 473.2, close: 475.1, volume: 22300000 },
    { date: '2025-07-03', open: 475.0, high: 476.8, low: 471.5, close: 473.2, volume: 20900000 },
    { date: '2025-07-04', open: 473.0, high: 478.5, low: 472.8, close: 476.5, volume: 17600000 },
    { date: '2025-07-05', open: 476.8, high: 482.0, low: 476.0, close: 480.2, volume: 19100000 },
    { date: '2025-07-06', open: 480.5, high: 485.3, low: 479.8, close: 483.8, volume: 21000000 },
    { date: '2025-07-07', open: 484.0, high: 484.5, low: 478.0, close: 480.1, volume: 23500000 },
    { date: '2025-07-08', open: 480.0, high: 481.2, low: 475.5, close: 477.3, volume: 22800000 },
    { date: '2025-07-09', open: 477.0, high: 477.8, low: 473.0, close: 474.5, volume: 20500000 },
    { date: '2025-07-10', open: 474.3, high: 475.0, low: 470.2, close: 472.1, volume: 18800000 },
    { date: '2025-07-11', open: 472.0, high: 473.5, low: 469.8, close: 471.0, volume: 17200000 },
    { date: '2025-07-12', open: 470.8, high: 471.5, low: 468.0, close: 469.5, volume: 16500000 },
    { date: '2025-07-13', open: 469.3, high: 475.0, low: 469.0, close: 473.8, volume: 19400000 },
    { date: '2025-07-14', open: 474.0, high: 482.6, low: 473.5, close: 480.1, volume: 23800000 },
    { date: '2025-07-15', open: 480.5, high: 495.0, low: 479.8, close: 492.3, volume: 28500000 },
    { date: '2025-07-16', open: 492.5, high: 502.8, low: 491.0, close: 498.6, volume: 31200000 },
    { date: '2025-07-17', open: 498.8, high: 505.0, low: 497.5, close: 503.1, volume: 29700000 },
    { date: '2025-07-18', open: 503.5, high: 506.2, low: 501.8, close: 504.5, volume: 25400000 },
    { date: '2025-07-19', open: 504.8, high: 507.0, low: 503.0, close: 505.2, volume: 21800000 },
    { date: '2025-07-20', open: 505.0, high: 512.5, low: 504.2, close: 510.8, volume: 24600000 },
    { date: '2025-07-21', open: 511.0, high: 520.3, low: 510.5, close: 518.2, volume: 27300000 },
    { date: '2025-07-22', open: 521.5, high: 525.5, low: 519.0, close: 521.46, volume: 16414000 },
  ],
}

const STOCK_DATA = {
  xAxis: {
    data: stockData.data.map((item) => item.date),
    type: 'category',
    axisLabel: {
      interval: Math.floor(stockData.data.length / 4), // 计算间隔使只显示4-5个标签
    },
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      const data = params[0].data
      return `
        <div><strong>${props.companyInfo.currency} $${data.close}</strong></div>
        <div>${params[0].axisValueLabel}</div>
        <div>成交量：${formatNumberToWan(data.volume)}</div>
      `
    },
  },
  yAxis: {
    scale: true,
    axisLabel: {
      formatter: '{value}',
    },
  },
  series: [
    {
      name: '0700 股价',
      data: stockData.data.map((item) => ({
        value: item.close,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      })),
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: '#5470C6',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(84, 112, 198, 0.5)',
            },
            {
              offset: 1,
              color: 'rgba(84, 112, 198, 0.1)',
            },
          ],
        },
      },
    },
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
}

const stockOptions = ref(OPTIONS.stock)
const onSearch = () => {
  stockOptions.value = OPTIONS.stock.filter((item) => item.title.indexOf(search.value) !== -1)
}
onMounted(() => {
  initChart('mainChart', mainChart, STOCK_DATA, onUnmounted)
})
</script>

<style scoped lang="less">
@import '../index.less';
</style>
