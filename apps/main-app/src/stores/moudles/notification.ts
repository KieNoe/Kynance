import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 定义通知类型
interface NotificationTag {
  name: string
  class: 'success' | 'warning' | 'danger' | 'primary'
}

interface NotificationItem {
  id: string | number
  tag: NotificationTag
  title: string
  content: string
  date: string
  read?: boolean
  archived?: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref<NotificationItem[]>([
    {
      id: 1,
      tag: {
        name: '平台通知',
        class: 'success',
      },
      title: '欢迎加入 Kynance 量化交易平台',
      content: '您的账户已成功激活！立即体验智能策略、实时行情和深度分析，开启您的量化投资之旅。',
      date: '2025-08-16 16:51',
      read: false,
      archived: false,
    },
    {
      id: 2,
      tag: {
        name: '策略提醒',
        class: 'success',
      },
      title: '动量策略执行完成',
      content: '您的"黄金交叉策略"于今日15:00触发，成功买入AAPL 200股，成交均价182.56美元',
      date: '2025-08-16 15:02',
      read: false,
      archived: false,
    },
    {
      id: 3,
      tag: {
        name: '异动预警',
        class: 'warning',
      },
      title: 'TSLA股价波动异常',
      content: '您关注的特斯拉(TSLA)当前跌幅-7.2%，已突破布林带下轨，成交量放大至平日3倍',
      date: '2025-08-16 14:30',
      read: false,
      archived: false,
    },
  ])

  // 计算属性
  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
  const activeNotifications = computed(() => notifications.value.filter((n) => !n.archived))
  const archivedNotifications = computed(() => notifications.value.filter((n) => n.archived))

  // 操作方法
  const markAsRead = (id) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true))
  }

  const archiveNotification = (id) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.archived = true
    }
  }

  const restoreNotification = (id) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.archived = false
    }
  }

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'read' | 'archived'>) => {
    const newId =
      Math.max(...notifications.value.map((n) => (typeof n.id === 'number' ? n.id : 0))) + 1
    notifications.value.unshift({
      ...notification,
      id: newId,
      read: false,
      archived: false,
    })
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    notifications,
    unreadCount,
    activeNotifications,
    archivedNotifications,

    markAsRead,
    markAllAsRead,
    archiveNotification,
    restoreNotification,
    addNotification,
    removeNotification,
  }
})
