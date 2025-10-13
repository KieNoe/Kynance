<template>
  <div class="demo-root">
    <header class="demo-header">
      <div class="title">
        <h1>轻量级用户行为预测模型 · 演示</h1>
        <p class="subtitle">使用 TensorFlow.js —— <span>自制轻量模型</span></p>
      </div>
      <div class="header-actions">
        <t-button theme="primary" size="medium" :loading="loading" @click="startDisplay">
          <template #icon><play-icon /></template>
          开始演示</t-button
        >
        <t-button variant="text" size="medium" @click="toggleSetting" :loading="loading">
          <template #icon><SettingIcon /></template>
          参数配置</t-button
        >
      </div>
    </header>

    <main class="demo-grid">
      <!-- 左：用户操作面板 -->
      <section class="panel actions-panel t-card">
        <div class="panel-head">
          <h3>用户操作 (模拟)</h3>
          <small>点击按钮模拟用户行为轨迹</small>
        </div>
        <div class="actions">
          <t-button
            class="action-btn"
            variant="text"
            :loading="loading"
            v-for="action in actions"
            @click="addAction(action)"
            >{{ action }}</t-button
          >
        </div>

        <div class="history">
          <h4>最近操作</h4>
          <ul>
            <li v-for="action in actionsList"><span class="dot"></span>{{ action }}</li>
          </ul>
        </div>
      </section>

      <!-- 中：预测展示 -->
      <section class="panel predict-panel t-card">
        <div class="panel-head">
          <h3>下一步预测</h3>
          <small>模型推断出的最可能动作（示例）</small>
        </div>

        <div class="predict-area">
          <div class="prediction-card" v-for="prediction in predictionList">
            <div class="pred-label">预测动作</div>
            <div class="pred-action">{{ prediction.label }}</div>
            <div class="confidence">
              <div class="conf-bar">
                <div class="conf-fill" :style="{ width: prediction.value + '%' }"></div>
              </div>
              <div class="conf-text">置信度：{{ prediction.value }}%</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右：预加载优化对比 -->
      <section class="panel preload-panel t-card">
        <div class="panel-head">
          <h3>预加载优化效果对比</h3>
          <small>展示资源加载时间线与用户感知差异</small>
        </div>

        <div class="preload-comparison">
          <div
            class="pre-card"
            :class="preLoadingEffect.isHighlight ? 'highlight' : ''"
            v-for="preLoadingEffect in preLoadingEffects"
          >
            <div class="pre-title">{{ preLoadingEffect.label }}</div>
            <div class="timeline">
              <div
                class="bar"
                :class="preLoadingEffect.isHighlight ? 'fast' : 'slow'"
                :style="{ width: preLoadingEffect.width + '%' }"
              ></div>
            </div>
            <div class="meta">
              首包: {{ formatTime(preLoadingEffect.firstPackage, preLoadingEffect.isFormat) }} ·
              首屏渲染:
              {{ formatTime(preLoadingEffect.firstScreenRender, preLoadingEffect.isFormat) }} ·
              交互可用:
              {{ formatTime(preLoadingEffect.interactionAvailable, preLoadingEffect.isFormat) }}
            </div>
          </div>
        </div>
      </section>

      <!-- 底部：模型性能监控 -->
      <section class="panel metrics-panel t-card full-width">
        <div class="panel-head">
          <h3>模型性能指标监控</h3>
          <small>可视化展示：准确率、延迟、吞吐量、损失等</small>
        </div>

        <div class="metrics-grid">
          <div class="metric-card" v-for="performanceIndicator in performanceIndicators">
            <div class="metric-title">{{ performanceIndicator.title }}</div>
            <div class="metric-value">
              {{ performanceIndicator.value + performanceIndicator.unit }}
            </div>
            <div class="metric-bar">
              <div
                class="metric-fill"
                :style="{
                  width: (performanceIndicator.value / performanceIndicator.standard) * 100 + '%',
                }"
              ></div>
            </div>
          </div>
        </div>
        <div class="lineChart" ref="lineChart">
          <ChartLineIcon />
          <p>点击“开始演示”，图表将伴随数据变化实时更新</p>
        </div>
      </section>
    </main>

    <footer class="demo-footer">
      <small>注：模型所用数据均为模拟生成，仅供演示</small>
    </footer>
    <t-dialog v-model:visible="settingVisible" width="500px" top="3%" header="参数配置">
      <parameterSetting :testConfig="testConfig" />
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, SettingIcon } from 'tdesign-icons-vue-next'
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { ChartLineIcon } from 'tdesign-icons-vue-next'

import parameterSetting from './components/parameterSetting.vue'

const settingVisible = ref(false)
const loading = ref(true)
const actions = ref(['查看商品', '加入购物车', '开始结算', '离开页面'])
const actionsList = ref(['点击: 查看商品', '点击: 加入购物车', '点击: 查看详情'])
const chartData = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
const lineChart = ref<HTMLElement | null>(null)
let chart = null
const predictionList = ref([
  { label: '开始结算', value: 78 },
  { label: '查看详情', value: 18 },
])
const preLoadingEffects = ref([
  {
    label: '未启用预加载',
    firstPackage: 680,
    firstScreenRender: 1200,
    interactionAvailable: 1800,
    isFormat: true,
    width: 84,
    isHighlight: false,
  },
  {
    label: '启用预加载',
    firstPackage: 220,
    firstScreenRender: 420,
    interactionAvailable: 580,
    isFormat: true,
    width: 36,
    isHighlight: true,
  },
  {
    label: '性能对比',
    firstPackage: 68,
    firstScreenRender: 64,
    interactionAvailable: 59,
    isFormat: false,
    width: 36,
    isHighlight: true,
  },
])
const performanceIndicators = ref([
  { title: '准确率 (Accuracy)', value: 82.4, unit: '%', standard: 100 },
  { title: '平均延迟 (ms)', value: 42, unit: 'ms', standard: 200 },
  { title: '每秒推理数 (QPS)', value: 240, unit: '', standard: 1000 },
  { title: '模型大小 (MB)', value: 270, unit: '', standard: 1000 },
])

const testConfig = ref({
  totalOperations: 10000, // 总操作数
  userCount: 500, // 模拟用户数量
  sessionDurationRange: [300, 3600], // 单次会话时长范围（秒）
  featureDimensions: 8, // 每步行为的特征维度
  sequenceLength: 10, // 每个用户行为序列长度
  operationTransitionBias: 0.8, // 操作间顺序依赖强度（高=操作更规律）
})

const startDisplay = () => {
  if (!chart) {
    chart = echarts.init(lineChart.value)
  }
  pushData()

  setInterval(() => {
    pushData()
  }, 500)
}

const addAction = (action) => {
  actionsList.value.unshift(`点击: ${action}`)
  if (actionsList.value.length > 3) {
    actionsList.value.pop()
  }
  predictionList.value.unshift({ label: action, value: 60 })
  if (predictionList.value.length > 2) {
    predictionList.value.pop()
  }
}

const toggleSetting = () => {
  settingVisible.value = !settingVisible.value
}

const formatTime = (time, isTime) => {
  if (isTime) {
    if (time < 1000) {
      return `${Math.floor(time)}ms`
    }

    const s = time / 1000
    if (s < 60) {
      return `${Math.floor(s)}s`
    }

    const m = s / 60
    if (m < 60) {
      return `${Math.floor(m)}m`
    }

    const h = m / 60
    return `${Math.floor(h)}h`
  } else {
    return time + '%'
  }
}

const updateChart = () => {
  if (!chart) return
  chart.setOption({
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: chartData,
        type: 'line',
        showSymbol: false,
        smooth: true,
      },
    ],
  })
}

const pushData = () => {
  chartData.push(Math.random())
  updateChart()
}

setTimeout(() => {
  loading.value = false
}, 1000)
onMounted(() => {})
onUnmounted(() => {})
</script>

<style scoped>
@import url('./index.less');
</style>
