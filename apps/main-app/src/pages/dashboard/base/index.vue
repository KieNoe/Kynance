<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getMarketSummary, getHistory } from '@/services/client'

const data = ref()
onMounted(() => {
  getMarketSummary().then((res) => {
    console.log('res', res)
    data.value = res
  })
  getHistory('AAPL').then((res) => {
    console.log('history', res)
  })
})
</script>
<template>
  <div>
    <div v-if="data">
      {{ data }}
    </div>
  </div>
</template>
<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
