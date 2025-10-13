<template>
  <div class="reload-page">
    <div class="card">
      <t-progress theme="circle" :percentage="progress" />
      <t-space>正在重载页面...</t-space>
      <t-space>如果长时间没有响应，请尝试手动重试。</t-space>
      <t-space>如果问题仍然存在，请联系管理员。</t-space>
      <t-button variant="text" @click="onRetry">手动重试</t-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'

const progress = ref(0)

function onRetry() {
  window.location.reload()
}

const id = setInterval(() => {
  progress.value += 3
  if (progress.value >= 100) {
    progress.value = 0
    clearInterval(id)
  }
}, 100)
</script>

<style scoped>
.reload-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--td-bg-color-page);
  z-index: 9999;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 6px 24px var(--td-component-border);
  background: var(--td-bg-color-page);
}
</style>
