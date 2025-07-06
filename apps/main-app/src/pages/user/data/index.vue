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
    </t-col>
    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">K</t-avatar>
        <div class="name">My Account</div>
        <div class="position">{{ t('pages.user.personalInfo.description') }}</div>
      </t-card>
    </t-col>
  </t-row>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores'
import { getDiffDays, getDatePeriod } from '@/infrastructure/utils'
import { t } from '@/infrastructure/locales'
const userStore = useUserStore()
</script>
<style scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>
