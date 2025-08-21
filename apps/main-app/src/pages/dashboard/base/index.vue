<template>
  <div class="dashboard-container">
    <!-- 第一行：欢迎卡片和功能入口 -->
    <div class="firstRow">
      <!-- 欢迎卡片 -->
      <t-card class="welcome-card" :bordered="false">
        <template #title>
          <div class="welcome-header">
            <t-avatar class="avatar" :image="userAvatar" size="2.8125rem" />
            <div class="welcome-info">
              <h3 class="welcome-title">
                {{ t('pages.dashboard.welcome') + userStore.user.name }}
              </h3>
              <p class="welcome-subtitle">
                {{ t('pages.dashboard.today') + currentDate + t('pages.dashboard.wish') }}
              </p>
            </div>
          </div>
        </template>

        <div class="welcome-content">
          <t-row :gutter="[16, 16]">
            <t-col v-for="(stat, index) in STATISTICS" :key="index" :xs="24" :sm="12" :md="6">
              <t-statistic v-bind="stat as any" />
            </t-col>
          </t-row>
        </div>
      </t-card>

      <!-- 功能入口卡片 -->
      <div class="right">
        <div v-for="(feature, index) in FEATURES" :key="index">
          <t-card
            :bordered="false"
            :class="['feature-card', `feature-card-${index}`]"
            hoverable
            @click="navigateTo(feature.route)"
          >
            <template #avatar>
              <t-icon :name="feature.icon" size="2.1rem" />
            </template>
            <template #title>{{ feature.title }}</template>
            <template #description>{{ feature.description }}</template>
            <template #actions>
              <t-icon
                name="chevron-right"
                size="1.875rem"
                style="margin-left: 4.0625rem; color: var(--td-text-color-primary)"
              />
            </template>
          </t-card>
        </div>
      </div>
    </div>

    <!-- 第二行：通知和市场概览 -->
    <div class="feature-cards">
      <!-- 通知区域 -->
      <div class="left">
        <t-notification
          v-for="(notice, idx) in NOTIFICATIONS"
          :key="idx"
          class="notification"
          :theme="notice.theme as any"
          :title="notice.title"
          :content="notice.content"
        />
      </div>

      <!-- 市场概览图表 -->
      <t-card :title="t('pages.dashboard.market')" :bordered="false" class="market-overview-card">
        <div ref="chartContainer" class="chart-container"></div>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

import { useUserStore } from '@/stores'
import { t } from '@/infrastructure/locales'

import { FEATURES, OPTIONS, STATISTICS, NOTIFICATIONS } from './contast'

const router = useRouter()
const userStore = useUserStore()
const chartContainer = ref<HTMLElement | null>(null)
let chart = null

// 数据部分
const userAvatar = ref('https://tdesign.gtimg.com/site/avatar.jpg')
const currentDate = computed(() => {
  const date = new Date()
  return (
    date.getFullYear() +
    t('pages.dashboard.year') +
    (date.getMonth() + 1) +
    t('pages.dashboard.month') +
    date.getDate() +
    t('pages.dashboard.day')
  )
})

// 方法部分
const navigateTo = (route) => {
  router.push(route)
}

const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    chart.setOption(OPTIONS)
  }
}

const handleResize = () => {
  chart?.resize()
}

// 生命周期
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
