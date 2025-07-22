<template>
  <t-card class="basicInfo" style="margin-bottom: 2vh">
    <div class="buttons">
      <t-tooltip content="修改布局">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="module" /></template> </t-button></t-tooltip
      ><t-tooltip content="生成分析报告">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="analytics" /></template> </t-button></t-tooltip
      ><t-tooltip content="收藏">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="star" /></template> </t-button></t-tooltip
      ><t-tooltip content="导出为PDF">
        <t-button shape="circle" variant="outline">
          <template #icon> <t-icon name="download" /></template> </t-button
      ></t-tooltip>
    </div>
    <div class="contents" v-for="i in data" :key="i.title">
      <t-divider style="margin: var(--td-comp-margin-m) 0"></t-divider>
      <div class="content">
        <t-tooltip :content="i.detail">
          <p>{{ i.title }}</p></t-tooltip
        >
        <p class="value">{{ i.value }}</p>
      </div>
    </div>
  </t-card>
</template>
<script setup lang="ts">
const data = [
  { title: '昨日收盘价', detail: '上次收盘价', value: '$519.00' },
  {
    title: '当日价格范围',
    detail: '上一交易日最高价和最低价之间的价差',
    value: '$514.5 - $522.5',
  },
  { title: '年度波幅', detail: '过去 52 周内最高价和最低价之间的价差', value: '$349.0 - $547.0' },
  {
    title: '市值',
    detail: '一种将公司股票价格乘以已发行股票总数的估值方法',
    value: '4.74万亿 HKD',
  },
  { title: '平均交易量', detail: '过去 30 天中每天平均交易的股票数量', value: '1,640.94万' },
  {
    title: '市盈率',
    detail: '当前股价与过去十二个月每股收益的比率，反映了股价与其他股票相比是高还是低',
    value: '22.27',
  },
  { title: '股息率', detail: '年度股息与当前股价的比率，用于估算股票的股息回报', value: '0.87%' },
  { title: '主要交易所', detail: '该证券的上市交易所', value: 'HKG' },
]
</script>
<style scoped lang="less">
@import '../index.less';
</style>
