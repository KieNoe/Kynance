<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getDailyGainer, getWatchList } from '@/services/client'

const data = ref()
onMounted(async () => {
  getDailyGainer('US').then((res) => {
    console.log('res', res)
    data.value = res
  })
  const res = await getWatchList([
    { name: '腾讯控股', code: '00700.HK' },
    { name: '阿里巴巴', code: '09988.HK' },
    { name: '贵州茅台', code: '600519.SH' },
  ])
  console.log('watch', res)
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
