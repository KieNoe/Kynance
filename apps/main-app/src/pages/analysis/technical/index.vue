<template>
  <t-row :gutter="[24, 24]" class="analysis-page">
    <t-col :flex="3">
      <Header :companyInfo="companyInfo"></Header>
      <Chart :companyInfo="companyInfo"></Chart>
    </t-col>
    <t-col :flex="1">
      <BasicInfo :companyInfo="companyInfo" :pageDOM="page" />
      <Introduction :companyInfo="companyInfo" />
    </t-col>
  </t-row>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Header from './component/Header.vue'
import Chart from './component/Chart.vue'
import BasicInfo from './component/BasicInfo.vue'
import Introduction from './component/Introduction.vue'
import { companyInfo } from './index'

const page = ref(null)

onMounted(() => {
  page.value = document.querySelector('.analysis-page')
  console.log(page.value)
})
</script>
<style scoped lang="less">
@import './index.less';
</style>
