<template>
  <div class="fundamental-analysis">
    <!-- 页面头部区域 -->
    <div class="page-header" role="banner">
      <div class="header-left">
        <h1 class="page-title">{{ t('pages.analysis.fundamental.analysis') }}</h1>
      </div>
      <div class="header-right">
        <t-button theme="default" variant="outline" @click="refreshData" :disabled="loading">
          <template #icon>
            <refresh-icon />
          </template>
          {{ t('pages.analysis.fundamental.button.refresh') }}
        </t-button>
        <span class="update-time"
          >{{ t('pages.analysis.fundamental.button.updateTime') }}: {{ updateTime }}</span
        >
      </div>
    </div>

    <!-- 公司信息卡片 -->
    <t-card :loading="loading" class="company-info-card" :bordered="false">
      <div class="company-header">
        <div class="company-basic">
          <div class="company-logo">
            <t-avatar size="large" :image="info.companyInfo.logo">
              {{ info.companyInfo.name.charAt(0) }}
            </t-avatar>
          </div>
          <div class="company-details">
            <h2 class="company-name">{{ info.companyInfo.name }}</h2>
            <div class="company-meta">
              <t-tag theme="primary" variant="light">{{ info.companyInfo.code }}</t-tag>
              <t-tag theme="default" variant="light">{{ info.companyInfo.industry }}</t-tag>
            </div>
          </div>
        </div>
        <div class="stock-price">
          <div class="current-price" :class="priceChangeClass">
            ¥{{ info.companyInfo.currentPrice }}
          </div>
          <div class="price-change" :class="priceChangeClass">
            {{ info.companyInfo.priceChange > 0 ? '+' : '' }}{{ info.companyInfo.priceChange }} ({{
              info.companyInfo.priceChangePercent
            }}%)
          </div>
        </div>
      </div>
      <div class="company-stats">
        <div class="stat-item">
          <span class="stat-label">{{ t('pages.analysis.fundamental.company.marketCap') }}</span>
          <span class="stat-value">{{ formatNumber(info.companyInfo.marketCap) }}亿</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{
            t('pages.analysis.fundamental.company.floatMarketCap')
          }}</span>
          <span class="stat-value">{{ formatNumber(info.companyInfo.floatMarketCap) }}亿</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('pages.analysis.fundamental.company.pe') }}</span>
          <span class="stat-value">{{ info.companyInfo.pe }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('pages.analysis.fundamental.company.pb') }}</span>
          <span class="stat-value">{{ info.companyInfo.pb }}</span>
        </div>
      </div>
    </t-card>

    <!-- 财务指标网格 -->
    <div class="financial-indicators" role="complementary">
      <h3 class="section-title">{{ t('pages.analysis.fundamental.financialIndicators.title') }}</h3>
      <div class="indicators-grid">
        <t-card
          v-for="indicator in info.financialIndicators"
          :key="indicator.key"
          class="indicator-card"
          :bordered="false"
          :loading="loading"
        >
          <div class="indicator-header">
            <span class="indicator-name">{{ indicator.name }}</span>
            <t-tag :theme="getIndicatorTheme(indicator.rating)" variant="light" size="small">
              {{ indicator.rating }}
            </t-tag>
          </div>
          <div class="indicator-value">{{ indicator.value }}</div>
          <div class="indicator-change" :class="getChangeClass(indicator.change)">
            {{ indicator.change > 0 ? '+' : '' }}{{ indicator.change }}%
            <span class="change-label">{{
              t('pages.analysis.fundamental.financialIndicators.yearOverYear')
            }}</span>
          </div>
          <div class="indicator-progress">
            <t-progress
              :percentage="indicator.score"
              :theme="getProgressTheme(indicator.score)"
              :show-info="false"
              size="small"
            />
          </div>
        </t-card>
      </div>
    </div>

    <!-- 趋势图表区域 -->
    <div class="charts-section" role="complementary">
      <div class="charts-grid">
        <t-card class="chart-card" :bordered="false">
          <template #header>
            <span class="chart-title">{{
              t('pages.analysis.fundamental.chart.revenueTrend')
            }}</span>
          </template>
          <div ref="revenueChartRef" class="chart-container"></div>
        </t-card>
        <t-card class="chart-card" :bordered="false">
          <template #header>
            <span class="chart-title">{{
              t('pages.analysis.fundamental.chart.profitability')
            }}</span>
          </template>
          <div ref="profitabilityChartRef" class="chart-container"></div>
        </t-card>
      </div>
    </div>

    <!-- 风险提示面板 -->
    <t-card class="risk-panel" :bordered="false" :loading="loading" role="complementary">
      <template #header>
        <span class="section-title">{{ t('pages.analysis.fundamental.risk.assessment') }}</span>
      </template>
      <div class="risk-items">
        <div v-for="risk in info.riskAssessment" :key="risk.type" class="risk-item">
          <div class="risk-header">
            <t-tag :theme="getRiskTheme(risk.level)" variant="light">
              {{ risk.level }}
            </t-tag>
            <span class="risk-type">{{ risk.type }}</span>
          </div>
          <p class="risk-description">{{ risk.description }}</p>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { RefreshIcon } from 'tdesign-icons-vue-next'
import * as echarts from 'echarts'

import { t } from '@/infrastructure/locales'
import { getCompanyInfo } from '@/services/client'

import { info } from '.'

// 响应式数据
const updateTime = ref('')
const loading = ref(false)
const revenueChartRef = ref(null)
const profitabilityChartRef = ref(null)

// 计算属性
const priceChangeClass = computed(() => {
  return info.companyInfo.priceChange > 0 ? 'price-up' : 'price-down'
})

// 方法
const formatNumber = (num) => {
  return (num / 10000).toFixed(2)
}

const getIndicatorTheme = (rating) => {
  const themeMap = {
    [t('pages.analysis.fundamental.ratings.excellent')]: 'success',
    [t('pages.analysis.fundamental.ratings.good')]: 'primary',
    [t('pages.analysis.fundamental.ratings.average')]: 'warning',
    [t('pages.analysis.fundamental.ratings.poor')]: 'danger',
  }
  return themeMap[rating] || 'default'
}

const getChangeClass = (change) => {
  return change > 0 ? 'change-up' : 'change-down'
}

const getProgressTheme = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  if (score >= 40) return 'warning'
  return 'danger'
}

const getRiskTheme = (level) => {
  const themeMap = {
    [t('pages.analysis.fundamental.risk.levels.low')]: 'success',
    [t('pages.analysis.fundamental.risk.levels.medium')]: 'warning',
    [t('pages.analysis.fundamental.risk.levels.high')]: 'danger',
  }
  return themeMap[level] || 'default'
}

const refreshData = async () => {
  loading.value = true
  updateTime.value = new Date().toLocaleString('zh-CN')
  Object.assign(info, await getCompanyInfo())
  MessagePlugin.success(t('pages.analysis.fundamental.refresh'))
  loading.value = false
}

const initRevenueChart = () => {
  if (!revenueChartRef.value) return

  const chart = echarts.init(revenueChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: [
        t('pages.analysis.fundamental.financialIndicators.revenue'),
        t('pages.analysis.fundamental.financialIndicators.netProfit'),
      ],
    },
    xAxis: {
      type: 'category',
      data: ['2019', '2020', '2021', '2022', '2023'],
    },
    yAxis: {
      type: 'value',
      name: t('pages.analysis.fundamental.chart.amount'),
    },
    series: [
      {
        name: t('pages.analysis.fundamental.financialIndicators.revenue'),
        type: 'line',
        data: [3773, 4820, 5601, 5545, 5601],
        itemStyle: { color: '#0052D9' },
      },
      {
        name: t('pages.analysis.fundamental.financialIndicators.netProfit'),
        type: 'line',
        data: [933, 1227, 1237, 1156, 1227],
        itemStyle: { color: '#00A870' },
      },
    ],
  }
  chart.setOption(option)
}

const initProfitabilityChart = () => {
  if (!profitabilityChartRef.value) return

  const chart = echarts.init(profitabilityChartRef.value)
  const option = {
    tooltip: {},
    radar: {
      indicator: [
        { name: 'ROE', max: 25 },
        { name: 'ROA', max: 15 },
        { name: t('pages.analysis.fundamental.chart.grossMargin'), max: 60 },
        { name: t('pages.analysis.fundamental.chart.netProfit'), max: 30 },
        { name: t('pages.analysis.fundamental.chart.assetTurnover'), max: 2 },
      ],
    },
    series: [
      {
        name: t('pages.analysis.fundamental.chart.profit'),
        type: 'radar',
        data: [
          {
            value: [16.8, 8.9, 45.2, 21.9, 0.8],
            name: t('pages.analysis.fundamental.chart.current'),
            itemStyle: { color: '#0052D9' },
          },
        ],
      },
    ],
  }
  chart.setOption(option)
}

onMounted(async () => {
  updateTime.value = new Date().toLocaleString('zh-CN')

  // 初始化图表
  setTimeout(() => {
    initRevenueChart()
    initProfitabilityChart()
  }, 100)
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
