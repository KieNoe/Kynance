<!-- components/ErrorBoundary.vue -->
<template>
  <div>
    <div v-if="error" class="p-4 border rounded bg-red-50 text-red-600">
      <h2 class="font-semibold text-lg mb-2">⚠️ 出错啦！</h2>
      <p class="mb-2">{{ error.message }}</p>
      <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" @click="resetError">
        重试
      </button>
    </div>

    <slot v-else :key="key"></slot>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)
const key = ref('0')

onErrorCaptured((err) => {
  //这里可以上报到服务器日志
  console.error('🧱 ErrorBoundary 捕获到错误：', err)
  error.value = err
  return false
})

function resetError() {
  error.value = null
  key.value++
}
</script>
