<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <Header :companyInfo="companyInfo"></Header>
      <Chart :companyInfo="companyInfo"></Chart>
      <Footer></Footer>
    </t-col>
    <t-col :flex="1">
      <BasicInfo :companyInfo="companyInfo" />
      <Introduction :companyInfo="companyInfo" />
    </t-col>
  </t-row>
</template>
<script setup lang="ts">
import Header from './component/Header.vue'
import Chart from './component/Chart.vue'
import Footer from './component/Footer.vue'
import BasicInfo from './component/BasicInfo.vue'
import Introduction from './component/Introduction.vue'
const companyInfo = {
  name: '腾讯',
  price: '$518.50',
  change: '0.25',
  changePercent: '0.25%',
  market: 'HKG',
  currency: 'HKD',
  introduction: [
    {
      title: '公司名称',
      detail: '腾讯控股有限公司',
      value: '腾讯控股有限公司',
    },
    {
      title: '公司类型',
      detail: '民营 & 上市',
      value: '民营 & 上市',
    },
    {
      title: '股票代码',
      detail: '00700（港股）',
      value: '00700',
    },
    {
      title: '成立时间',
      detail: '1998年11月11日',
      value: '1998.11.11',
    },
    {
      title: '代表人物',
      detail: '马化腾（创始人兼董事会主席）',
      value: '马化腾',
    },
    {
      title: '首席执行官',
      detail: '马化腾',
      value: '马化腾',
    },
    {
      title: '总部',
      detail: '中国广东省深圳市南山区腾讯滨海大厦',
      value: '中国深圳',
    },
    {
      title: '产业',
      detail: '互联网、科技、数字娱乐、金融科技、云计算',
      value: '互联网',
    },
    {
      title: '主要产品',
      detail: '微信、QQ、腾讯云、腾讯游戏、腾讯视频、腾讯音乐',
      value: '微信、QQ等',
    },
    {
      title: '员工人数',
      detail: '约112,000人（2023年数据）',
      value: '112,000人',
    },
    {
      title: '年营业额',
      detail: '约5,600亿元人民币（2023年）',
      value: '5,600亿元',
    },
    {
      title: '市值',
      detail: '约3.5万亿港元（2023年）',
      value: '3.5万亿港元',
    },
    {
      title: '企业口号',
      detail: '用户为本，科技向善',
      value: '用户为本，科技向善',
    },
    {
      title: '主要市场',
      detail: '中国及全球多个国家和地区',
      value: '全球市场',
    },
    {
      title: '技术创新',
      detail: '人工智能、大数据、区块链、云计算',
      value: '多项前沿技术',
    },
  ],
  basicInfo: [
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
  ],
}
</script>
<style scoped lang="less">
@import './index.less';
</style>
