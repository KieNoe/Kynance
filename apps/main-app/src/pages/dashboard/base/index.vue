<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getMarketSummary } from '@/services/client'

const data = ref()
onMounted(() => {
  getMarketSummary().then((res) => {
    console.log('res', res)
    data.value = res
  })
})
</script>
<template>
  <div>
    <div v-if="data">
      {{ data }}
      {{ data[0].symbol }}
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
