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
      <singlePrediction :loading="loading" :predictNextAction="predictAction" />

      <optimizationComparison />

      <performanceIndication
        ref="performanceIndicationRef"
        :predictAction="predictAction"
        :testConfig="testConfig"
      />
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
import { onMounted, onUnmounted, ref } from 'vue'
import { TYPES } from '@kynance/types'
import { IBehaviorPredictor } from '@kynance/types'

import { container } from '@/infrastructure/container/container'

import parameterSetting from './components/parameterSetting.vue'
import singlePrediction from './components/singlePrediction.vue'
import optimizationComparison from './components/optimizationComparison.vue'
import performanceIndication from './components/performanceIndication.vue'

let behaviorPredictor
const settingVisible = ref(false)
const loading = ref(true)
const performanceIndicationRef = ref(null)

const testConfig = ref({
  totalOperations: 100,
  userCount: 50,
  sessionDurationRange: [300, 3600],
  featureDimensions: 8,
  sequenceLength: 10,
  operationTransitionBias: 0.8,
})

const toggleSetting = () => {
  settingVisible.value = !settingVisible.value
}

const startDisplay = () => {
  performanceIndicationRef.value?.startDisplay()
}

const predictAction = async (num) => {
  return await behaviorPredictor.predictNextAction(num)
}

setTimeout(() => {
  loading.value = false
}, 1000)

onMounted(async () => {
  behaviorPredictor = container.get<IBehaviorPredictor>(TYPES.IBehaviorPredictor)
  await behaviorPredictor.initialize()
  console.log('Model info: ' + behaviorPredictor.getModelInfo())
  console.log('Predict result: ', await behaviorPredictor.predictNextAction(2))
})

onUnmounted(() => {
  behaviorPredictor.dispose()
})
</script>

<style scoped>
@import url('./index.less');
</style>
