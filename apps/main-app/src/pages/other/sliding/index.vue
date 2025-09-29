<template>
  <div class="sliding-chart-page">
    <!-- 页面头部 -->
    <t-card class="page-header" :bordered="false">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">动态采样流式数据图表</h1>
          <p class="page-subtitle">实时数据处理与智能采样优化</p>
        </div>
        <div class="status-section">
          <t-tag :theme="connectionStatus === 'connected' ? 'success' : 'danger'" variant="light">
            {{ connectionStatus === 'connected' ? '已连接' : '未连接' }}
          </t-tag>
          <t-tag theme="primary" variant="light"> 采样率: {{ currentSampleRate }}% </t-tag>
        </div>
      </div>
    </t-card>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <t-card class="control-panel" :bordered="false">
        <template #header>
          <div class="panel-header">
            <SettingIcon />
            <span>控制面板</span>
          </div>
        </template>

        <!-- 连接控制 -->
        <div class="control-section">
          <h4 class="section-title">连接控制</h4>
          <div class="control-group">
            <t-button
              :theme="isPlaying ? 'danger' : 'primary'"
              :loading="isConnecting"
              @click="handleConnection"
              block
            >
              {{ isPlaying ? '断开连接' : '开始连接' }}
            </t-button>
          </div>
        </div>

        <!-- 采样配置 -->
        <div class="control-section">
          <h4 class="section-title">采样配置</h4>
          <div class="control-group">
            <t-form-item label="采样策略">
              <t-select v-model="samplingStrategy" placeholder="选择采样策略">
                <t-option value="adaptive" label="自适应采样" />
                <t-option value="fixed" label="固定间隔" />
                <t-option value="threshold" label="阈值触发" />
              </t-select>
            </t-form-item>

            <t-form-item label="采样间隔(ms)">
              <t-slider
                v-model="samplingInterval"
                :min="100"
                :max="5000"
                :step="100"
                :marks="{ 100: '100ms', 1000: '1s', 5000: '5s' }"
              />
            </t-form-item>

            <t-form-item label="缓冲区大小">
              <t-input-number
                v-model="bufferSize"
                :min="100"
                :max="10000"
                :step="100"
                placeholder="数据点数量"
              />
            </t-form-item>
          </div>
        </div>

        <!-- 性能监控 -->
        <div class="control-section">
          <h4 class="section-title">性能监控</h4>
          <div class="performance-metrics">
            <div class="metric-item">
              <span class="metric-label">内存使用:</span>
              <t-progress
                :percentage="memoryUsage"
                :status="memoryUsage > 80 ? 'warning' : 'success'"
                size="small"
              />
            </div>
            <div class="metric-item">
              <span class="metric-label">CPU使用:</span>
              <t-progress
                :percentage="cpuUsage"
                :status="cpuUsage > 70 ? 'warning' : 'success'"
                size="small"
              />
            </div>
            <div class="metric-item">
              <span class="metric-label">数据延迟:</span>
              <span class="metric-value">{{ dataLatency }}ms</span>
            </div>
          </div>
        </div>

        <!-- 图表控制 -->
        <div class="control-section">
          <h4 class="section-title">图表控制</h4>
          <div class="control-group">
            <t-form-item label="显示数据点">
              <t-input-number
                v-model="displayPoints"
                :min="50"
                :max="1000"
                placeholder="显示的数据点数"
              />
            </t-form-item>

            <t-form-item label="自动缩放">
              <t-input-number v-model="autoScale" :min="0" :max="99" placeholder="显示的数据点数" />
            </t-form-item>
          </div>
        </div>
      </t-card>

      <!-- 右侧图表区域 -->
      <div class="chart-container">
        <!-- 图表工具栏 -->
        <t-card class="chart-toolbar" :bordered="false">
          <div class="toolbar-content">
            <div class="toolbar-left">
              <t-button-group>
                <t-button variant="outline" :disabled="!isPlaying" @click="pauseChart">
                  <template #icon>
                    <PauseIcon />
                  </template>
                  暂停
                </t-button>
                <t-button variant="outline" :disabled="isPlaying" @click="resumeChart">
                  <template #icon> <PlayIcon /> </template>继续
                </t-button>
                <t-button variant="outline" @click="clearChart">
                  <template #icon>
                    <ClearIcon />
                  </template>
                  清空
                </t-button>
              </t-button-group>
            </div>
            <div class="toolbar-right">
              <t-button variant="outline" @click="exportData" :loading="isExporting">
                <template #icon>
                  <DownloadIcon />
                </template>
                导出数据
              </t-button>
              <t-button variant="outline" @click="toggleFullscreen">
                <template #icon>
                  <FullscreenIcon />
                </template>
                全屏
              </t-button>
            </div>
          </div>
        </t-card>

        <!-- 主图表 -->
        <t-card class="main-chart" :bordered="false">
          <div class="chart-wrapper" ref="chartContainer">
            <div class="chart-placeholder">
              <ChartLineIcon class="placeholder-icon" />
              <p>图表将在此处显示</p>
              <p class="placeholder-hint">连接数据源后开始实时渲染</p>
            </div>
          </div>
        </t-card>

        <!-- 多图表视图 -->
        <mutiCharts />
      </div>
    </div>

    <!-- 底部状态栏 -->
    <t-card class="status-bar" :bordered="false">
      <div class="status-content">
        <div class="status-left">
          <span class="status-item">
            <ActivityIcon />
            数据点: {{ totalDataPoints }}
          </span>
          <span class="status-item">
            <TimeIcon />
            运行时间: {{ formatRuntime(totalDataPoints) }}
          </span>
        </div>
        <div class="status-right">
          <span class="status-item"> FPS: {{ currentFPS }} </span>
          <span class="status-item"> 延迟: {{ dataLatency }}ms </span>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  SettingIcon,
  PlayIcon,
  PauseIcon,
  ClearIcon,
  DownloadIcon,
  FullscreenIcon,
  ChartLineIcon,
  ActivityIcon,
  TimeIcon,
} from 'tdesign-icons-vue-next'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import { MessagePlugin } from 'tdesign-vue-next'

import mutiCharts from './components/mutiCharts.vue'

// 响应式数据定义
const connectionStatus = ref<'connected' | 'disconnected'>('disconnected')
const isConnecting = ref(false)
const isExporting = ref(false)
const currentSampleRate = ref(0)
const samplingStrategy = ref('adaptive')
const samplingInterval = ref(1000)
const bufferSize = ref(1000)
const memoryUsage = ref(45)
const cpuUsage = ref(32)
const dataLatency = ref(15)
const displayPoints = ref(500)
const autoScale = ref(0)
const isPlaying = ref(false)
const totalDataPoints = ref(0)
const runtime = ref(0)
const currentFPS = ref(60)

// 图表容器引用
const chartContainer = ref(null)
let chart = null

// 参数
const MAX_CACHE_POINTS = 100000
const MAX_RENDER_POINTS = 500
const THRESHOLD_POINTS = 5000

let rawData = []
let timer

// 计算属性
const formatRuntime = computed(() => (totalDataPoints) => {
  const seconds = totalDataPoints / 100
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = (seconds % 60).toFixed(0)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

function sampleData(data, mode) {
  if (data.length <= MAX_RENDER_POINTS) {
    currentSampleRate.value = 0
    return data
  }

  let sampled = []

  switch (mode) {
    case 'fixed': {
      const step = 10
      sampled = data.filter((_, idx) => idx % step === 0)
      break
    }

    case 'adaptive': {
      const step = Math.floor(data.length / MAX_RENDER_POINTS)
      sampled = data.filter((_, idx) => idx % step === 0)
      break
    }

    case 'threshold': {
      if (data.length <= THRESHOLD_POINTS) sampled = data
      const step = Math.floor(data.length / MAX_RENDER_POINTS)
      sampled = data.filter((_, idx) => idx % step === 0)
      break
    }
  }
  currentSampleRate.value = 82
  return sampled
}

/**
 * 模拟流式数据
 */
function pushData() {
  rawData.push({
    time: Date.now(),
    value: Math.random() * 100,
  })
  totalDataPoints.value += 1
  runtime.value += 1

  if (rawData.length > MAX_CACHE_POINTS) {
    rawData.shift()
  }

  updateChart()
}

/**
 * 更新图表
 */
function updateChart() {
  if (!chart) return

  const sampledAll = sampleData(rawData, samplingStrategy.value)

  const sampled = sampledAll.slice(-displayPoints.value)

  const option = {
    xAxis: {
      type: 'category',
      data: sampled.map((p) => new Date(p.time).toLocaleTimeString()),
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        data: sampled.map((p) => p.value),
        showSymbol: false,
        smooth: true,
      },
    ],
    dataZoom: [],
  }

  if (autoScale.value) {
    option.dataZoom = [
      { type: 'inside', start: autoScale.value, end: 100 },
      {
        type: 'slider',
        start: 0,
        end: 100,
        showDataShadow: false,
        realtime: true,
        filterMode: 'filter',
      },
    ]
  }

  chart.setOption(option)
}

const handleConnection = async () => {
  isConnecting.value = true

  try {
    if (!isPlaying.value) {
      initializeChart()
      connectionStatus.value = 'connected'
      isPlaying.value = true
    } else {
      clearInterval(timer)
      isPlaying.value = false
    }
  } catch (error) {
    console.error('连接操作失败:', error)
  } finally {
    isConnecting.value = false
  }
}

const pauseChart = () => {
  clearInterval(timer)
  isPlaying.value = false
}

const resumeChart = () => {
  initializeChart()
  connectionStatus.value = 'connected'
  isPlaying.value = true
}

const clearChart = () => {
  totalDataPoints.value = 0
  runtime.value = 0
  chart.clear()
  rawData.length = 0
}

const exportData = () => {
  isExporting.value = true
  const ws = XLSX.utils.json_to_sheet(rawData, {
    header: ['time', 'value'],
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  const fileName = `kynance-${Date.now()}.xlsx`
  XLSX.writeFile(wb, fileName) // 自动弹出下载框
  isExporting.value = false
}

const toggleFullscreen = async () => {
  MessagePlugin.info('点击全屏按钮')
}

const updatePerformanceMetrics = () => {
  // TODO: 更新性能指标
  // 模拟数据更新
  memoryUsage.value = Math.random() * 100
  cpuUsage.value = Math.random() * 100
  dataLatency.value = Math.floor(Math.random() * 50) + 10
  currentFPS.value = Math.floor(Math.random() * 20) + 50
}

// 图表渲染方法
const initializeChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    chart.setOption({
      xAxis: { type: 'category' },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [] }],
    })
  }

  timer = window.setInterval(pushData, 1)
}

// 生命周期钩子
onMounted(() => {
  const performanceTimer = setInterval(updatePerformanceMetrics, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (chart) chart.dispose()
})
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
