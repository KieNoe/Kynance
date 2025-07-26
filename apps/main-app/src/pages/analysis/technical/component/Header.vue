<template>
  <header class="card">
    <div class="header-title">
      <t-tooltip :content="companyInfo.description" show-arrow>
        <t-button variant="text" class="button"> {{ companyInfo.name }} </t-button></t-tooltip
      >
    </div>
    <div class="header-info">
      <div class="base">
        <div class="left">
          <p>{{ companyInfo.price }}</p>
        </div>
        <div class="right">
          <t-tag :color="settingStore.themeColor" variant="light" size="large" class="tag">
            <t-icon name="arrow-up" style="margin: 0"></t-icon>
            {{ companyInfo.changePercent }}
          </t-tag>
        </div>
      </div>
      <div class="comment">
        {{ dayjs().month() }}.{{ dayjs().date() }}, UTC+8 {{ dayjs().format('HH:mm:ss') }} ·
        {{ companyInfo.currency }} · {{ companyInfo.market }} ·
        <t-link @click="visible = true">
          {{ t('pages.analysis.technical.header.legalDisclaimer') }}
        </t-link>
      </div>
      <t-dialog
        destroyOnClose
        v-model:visible="visible"
        :on-confirm="() => (visible = false)"
        :header="t('pages.analysis.technical.header.legalDisclaimer') + '(bushi)'"
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
import dayjs from 'dayjs'

import { useSettingStore } from '@/stores'
import { t } from '@/infrastructure/locales'

import Disclaimer from './Disclaimer.vue'
defineProps({
  companyInfo: {
    type: Object,
    required: true,
  },
})

const settingStore = useSettingStore()
const visible = ref(false)
</script>
<style scoped lang="less">
@import '../index.less';
</style>
