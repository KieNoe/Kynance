<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{ userStore.user.name }}
          <span class="regular">
            {{ t(String('pages.user.' + getDatePeriod())) }}
            {{ t('pages.user.markDay1') }} {{ getDiffDays() }} {{ t('pages.user.markDay2') }}</span
          >
        </div>
      </div>
      <t-card class="user-info-list" :title="t('pages.user.personalInfo.title')" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-descriptions :column="4" item-layout="vertical">
          <t-descriptions-item
            v-for="(item, index) in USER_INFO_LIST"
            :key="index"
            :label="t(item.title)"
          >
            {{ item.content }}
          </t-descriptions-item>
        </t-descriptions>
      </t-card>
      <t-card class="content-container" :bordered="false">
        <t-card
          :bordered="false"
          class="card-padding-no"
          :title="t('pages.user.recentProfit')"
          describe="（次）"
        >
          <template #actions>
            <t-date-range-picker
              class="card-date-picker-container"
              :default-value="LAST_7_DAYS"
              theme="primary"
              mode="date"
            />
          </template>
          <div id="lineContainer" style="width: 100%; height: 328px"></div>
        </t-card>
      </t-card>
    </t-col>
    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">K</t-avatar>
        <div class="name">My Account</div>
        <div class="position">{{ t('pages.user.personalInfo.description') }}</div>
      </t-card>
      <t-card :title="t('pages.user.websiteRecommend')" class="user-team" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in WEBSITE_RECOMMEND" :key="index">
            <t-icon :name="item.logo" @click="handleNav(item)" style="cursor: pointer" />
            <t-list-item-meta :title="item.title" :description="item.description" />
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
  </t-row>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import { useUserStore } from '@/stores'
import { getDiffDays, getDatePeriod } from '@/infrastructure/utils'
import { LAST_7_DAYS } from '@/infrastructure/utils/date'
import { t } from '@/infrastructure/locales'
import { initChart } from '@/infrastructure/hook'

import { USER_INFO_LIST, WEBSITE_RECOMMEND, PROFIT_OPTION } from './index'
const userStore = useUserStore()
let lineChart

const handleNav = (item) => {
  window.open('https://' + item.title + '.com')
}

onMounted(() => {
  initChart('lineContainer', lineChart, PROFIT_OPTION, onUnmounted)
})
</script>
<style scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>
