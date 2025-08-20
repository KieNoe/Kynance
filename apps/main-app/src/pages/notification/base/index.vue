<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="notification">
      <div class="notification-header">
        <t-tabs v-model="activeTab">
          <t-tab-panel
            v-for="(tab, tabIndex) in TAB_LIST"
            :key="tabIndex"
            :value="tab.value"
            :label="tab.label"
          >
          </t-tab-panel>
        </t-tabs>
        <div class="notification-actions">
          <t-button
            theme="default"
            variant="text"
            @click="handleMarkAllAsRead"
            :disabled="!hasUnread"
          >
            {{ t('pages.notice.markAllRead') }}
          </t-button>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="notification-content">
        <template v-if="currentNotifications.length > 0">
          <div class="notification-list">
            <div
              v-for="item in currentNotifications"
              :key="item.id"
              class="notification-item"
              :class="{ 'notification-item--unread': !item.read }"
            >
              <div class="notification-item__header">
                <t-tag :theme="item.tag.class">{{ item.tag.name }}</t-tag>
                <span class="notification-item__title">{{ item.title }}</span>
                <span class="notification-item__date">{{ item.date }}</span>
              </div>
              <div class="notification-item__content">{{ item.content }}</div>
              <div class="notification-item__actions">
                <t-button
                  theme="default"
                  variant="text"
                  size="small"
                  @click="handleMarkAsRead(item.id)"
                  v-if="!item.read"
                >
                  {{ t('pages.notice.markRead') }}
                </t-button>
                <t-button
                  theme="default"
                  variant="text"
                  size="small"
                  @click="handleArchive(item.id)"
                >
                  {{ t('pages.notice.archive') }}
                </t-button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="notification-empty">
            <empty-icon></empty-icon>
            <p>{{ t('pages.notice.empty') }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { t } from '@/infrastructure/locales'
import EmptyIcon from '@/assets/assets-empty.svg'
import { useNotificationStore } from '@/stores/moudles/notification'

const notificationStore = useNotificationStore()

const TAB_LIST = [
  {
    label: t('pages.notice.all'),
    value: 'all',
  },
  {
    label: t('pages.notice.unread'),
    value: 'unread',
  },
  {
    label: t('pages.notice.read'),
    value: 'read',
  },
]

// 当前激活的标签页
const activeTab = ref('all')

// 根据当前标签页筛选通知
const currentNotifications = computed(() => {
  switch (activeTab.value) {
    case 'unread':
      return notificationStore.activeNotifications.filter((item) => !item.read)
    case 'read':
      return notificationStore.activeNotifications.filter((item) => item.read)
    default:
      return notificationStore.activeNotifications
  }
})

// 是否有未读消息
const hasUnread = computed(() => notificationStore.unreadCount > 0)

// 处理标记已读
const handleMarkAsRead = (id) => {
  notificationStore.markAsRead(id)
  MessagePlugin.success(t('pages.notice.markReadSuccess'))
}

// 处理全部标记已读
const handleMarkAllAsRead = () => {
  notificationStore.markAllAsRead()
  MessagePlugin.success(t('pages.notice.markAllReadSuccess'))
}

// 处理归档
const handleArchive = (id) => {
  notificationStore.archiveNotification(id)
  MessagePlugin.success(t('pages.notice.archiveSuccess'))
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
