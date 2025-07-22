<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3" class="red">
      <Header />
      <div id="chartContainer" class="card"></div>
      <footer class="card"></footer>
    </t-col>
    <t-col :flex="1" class="green">
      <BasicInfo />
      <t-card class="introduction"> 111111111111111111111 </t-card>
    </t-col>
  </t-row>
</template>
<script setup lang="ts">
import Header from './component/Header.vue'
import BasicInfo from './component/BasicInfo.vue'
</script>
<style scoped lang="less">
@import './index.less';
</style>
