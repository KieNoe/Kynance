<template>
  <div>
    <div class="notification">
      <t-tabs :default-value="TAB_LIST[0].value">
        <t-tab-panel
          v-for="(tab, tabIndex) in TAB_LIST"
          :key="tabIndex"
          :value="tab.value"
          :label="tab.label"
        >
          <div class="secondary-msg-list__empty-list">
            <empty-icon></empty-icon>
            <p>{{ t('pages.notice.empty') }}</p>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { t } from '@/infrastructure/locales'
import EmptyIcon from '@/assets/assets-empty.svg'

const TAB_LIST = [
  {
    label: t('pages.notice.all'),
    value: 'msgData',
  },
  {
    label: t('pages.notice.unread'),
    value: 'unreadMsg',
  },
  {
    label: t('pages.notice.read'),
    value: 'readMsg',
  },
]
</script>
<style scoped lang="less">
@import './index.less';
</style>
