<template>
  <header class="card">
    <div class="header-title">
      <t-tooltip content="腾讯 - HKG: 0700" show-arrow
        ><t-button variant="text" class="button"> 腾讯 </t-button></t-tooltip
      >
    </div>
    <div class="header-info">
      <div class="base">
        <p>$518.50</p>
        <t-tag color="green" variant="light" size="large" class="tag">
          <t-icon name="arrow-up" style="margin: 0"></t-icon>
          0.25%
        </t-tag>
      </div>
      <div class="comment">
        7.21, UTC+8 14:08:45 · HKD · HKG · <t-link @click="visible = true"> 免责声明 </t-link>
      </div>
      <t-dialog
        destroyOnClose
        v-model:visible="visible"
        :on-confirm="() => (visible = false)"
        header="免责声明(bushi)"
        top="2vh"
        width="70%"
      >
        <Disclaimer />
      </t-dialog>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Disclaimer from './Disclaimer.vue'
const visible = ref(false)
</script>
<style scoped lang="less">
@import '../index.less';
</style>
