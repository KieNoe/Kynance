<template>
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
</template>
<script setup lang="ts">
import { ref } from 'vue'

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
    width: 72,
    isHighlight: true,
  },
])

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
</script>
<style scoped lang="less">
@import url('../index.less');
</style>
