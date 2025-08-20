<template>
  <t-popup expand-animation placement="bottom-right" trigger="click">
    <template #content>
      <div class="header-msg">
        <div class="header-msg-top">
          <p>{{ t('layout.notice.title') }}</p>
          <t-button
            v-if="activeNotifications.length > 0"
            class="clear-btn"
            variant="text"
            theme="primary"
            @click="setRead('all')"
            >{{ t('layout.notice.clear') }}</t-button
          >
        </div>
        <t-list v-if="activeNotifications.length > 0" class="narrow-scrollbar" :split="false">
          <t-list-item v-for="(item, index) in activeNotifications" :key="index">
            <div>
              <p class="msg-content">{{ item.title }}</p>
              <p class="msg-type">{{ item.tag.name }}</p>
            </div>
            <p class="msg-time">{{ item.date }}</p>
            <template #action>
              <t-button size="small" variant="outline" @click="setRead('radio', item as any)">
                {{ t('layout.notice.setRead') }}
              </t-button>
            </template>
          </t-list-item>
        </t-list>

        <div v-else class="empty-list">
          <img src="https://tdesign.gtimg.com/pro-template/personal/nothing.png" alt="空" />
          <p>{{ t('layout.notice.empty') }}</p>
        </div>
        <div v-if="activeNotifications.length > 0" class="header-msg-bottom">
          <t-button
            class="header-msg-bottom-link"
            variant="text"
            theme="default"
            block
            @click="goDetail"
            >{{ t('layout.notice.viewAll') }}</t-button
          >
        </div>
      </div>
    </template>
    <t-badge
      :count="activeNotifications.length"
      :offset="[4, 4]"
      style="margin-right: 0.4em; margin-left: 0.4em"
    >
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="mail" />
      </t-button>
    </t-badge>
  </t-popup>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import { t } from '@/infrastructure/locales'
import { useNotificationStore } from '@/stores'
import router from '@/router'

const store = useNotificationStore()
const activeNotifications = computed(() =>
  store.notifications.filter((n) => !n.archived && !n.read),
)

const goDetail = () => {
  router.push('/notification/base')
}
const setRead = (type, item = { id: 1 }) => {
  if (type === 'all') {
    store.markAllAsRead()
  } else {
    store.markAsRead(item.id)
  }
}
</script>
<style lang="less" scoped>
.header-msg {
  width: 25rem;
  margin: calc(0px - var(--td-comp-paddingTB-xs)) calc(0px - var(--td-comp-paddingLR-s));

  .header-msg-top {
    height: 2rem;
  }

  .empty-list {
    // height: calc(100% - 120px);
    text-align: center;
    padding: var(--td-comp-paddingTB-xxl) 0;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);

    img {
      width: var(--td-comp-size-xxxxl);
    }

    p {
      margin-top: var(--td-comp-margin-xs);
    }
  }

  &-top {
    position: relative;
    font: var(--td-font-title-medium);
    color: var(--td-text-color-primary);
    text-align: left;
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-xl) 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .clear-btn {
      right: calc(var(--td-comp-paddingTB-l) - var(--td-comp-paddingLR-xl));
    }
  }

  &-bottom {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    border-top: 1px solid var(--td-component-stroke);

    &-link {
      text-decoration: none;
      cursor: pointer;
      color: var(--td-text-color-placeholder);
    }
  }

  .t-list {
    height: calc(100% - 6.5rem);
    padding: var(--td-comp-margin-s) var(--td-comp-margin-s);
  }

  .t-list-item {
    overflow: hidden;
    height: 3.25rem;
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);
    border-radius: var(--td-radius-default);
    font: var(--td-font-body-medium);
    color: var(--td-text-color-primary);
    cursor: pointer;
    transition: background-color 0.2s linear;

    &:hover {
      background-color: var(--td-bg-color-container-hover);

      .msg-content {
        color: var(--td-brand-color);
      }

      .t-list-item__action {
        button {
          bottom: var(--td-comp-margin-l);
          opacity: 1;
        }
      }

      .msg-time {
        bottom: -1rem;
        opacity: 0;
      }
    }

    .msg-content {
      margin-bottom: var(--td-comp-margin-s);
    }

    .msg-type {
      color: var(--td-text-color-secondary);
    }

    .t-list-item__action {
      button {
        opacity: 0;
        position: absolute;
        right: var(--td-comp-margin-xxl);
        bottom: -0.375rem;
      }
    }

    .msg-time {
      transition: all 0.2s ease;
      opacity: 1;
      position: absolute;
      right: var(--td-comp-margin-xxl);
      bottom: 0;
      color: var(--td-text-color-secondary);
    }
  }
}
</style>
