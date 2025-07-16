import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export interface NetworkState {
  since?: Date
  online?: boolean
  rtt?: number
  downlink?: number
  saveData?: boolean
  effectiveType?: string
  // 添加支持状态标识
  isSupported: boolean
}

enum NetworkEventType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CHANGE = 'change',
}

// 检测浏览器支持情况
function checkBrowserSupport() {
  const isOnlineSupported = 'onLine' in navigator
  let isNetworkInfoSupported = false

  try {
    const nav = navigator as any
    isNetworkInfoSupported =
      'connection' in nav || 'mozConnection' in nav || 'webkitConnection' in nav
  } catch (e) {
    isNetworkInfoSupported = false
  }

  return {
    isOnlineSupported,
    isNetworkInfoSupported,
  }
}

// 获取连接信息（带降级处理）
function getConnection() {
  try {
    const nav = navigator as any
    return nav.connection || nav.mozConnection || nav.webkitConnection || null
  } catch (e) {
    return null
  }
}

// 获取连接属性（带降级处理）
function getConnectionProperty(): Partial<NetworkState> {
  const c = getConnection()
  if (!c) return {}

  // 检查各个属性是否存在
  return {
    rtt: 'rtt' in c ? c.rtt : undefined,
    saveData: 'saveData' in c ? c.saveData : undefined,
    downlink: 'downlink' in c ? c.downlink : undefined,
    effectiveType: 'effectiveType' in c ? c.effectiveType : undefined,
  }
}

export function useNetwork(): Ref<NetworkState> {
  // 检查浏览器支持情况
  const { isOnlineSupported, isNetworkInfoSupported } = checkBrowserSupport()
  const isSupported = isOnlineSupported || isNetworkInfoSupported

  // 初始状态
  const initialState: NetworkState = {
    since: undefined,
    online: isOnlineSupported ? navigator.onLine : true, // 默认假设在线
    isSupported,
    ...(isNetworkInfoSupported ? getConnectionProperty() : {}),
  }

  const state = ref<NetworkState>(initialState)

  // 仅在有支持的情况下添加事件监听
  const onOnline = () => {
    state.value = {
      ...state.value,
      online: true,
      since: new Date(),
    }
  }

  const onOffline = () => {
    state.value = {
      ...state.value,
      online: false,
      since: new Date(),
    }
  }

  const onConnectionChange = () => {
    if (!isNetworkInfoSupported) return
    state.value = {
      ...state.value,
      ...getConnectionProperty(),
    }
  }

  onMounted(() => {
    if (!isSupported) return

    if (isOnlineSupported) {
      window.addEventListener(NetworkEventType.ONLINE, onOnline)
      window.addEventListener(NetworkEventType.OFFLINE, onOffline)
    }

    if (isNetworkInfoSupported) {
      const connection = getConnection()
      connection?.addEventListener?.(NetworkEventType.CHANGE, onConnectionChange)
    }
  })

  onUnmounted(() => {
    if (!isSupported) return

    if (isOnlineSupported) {
      window.removeEventListener(NetworkEventType.ONLINE, onOnline)
      window.removeEventListener(NetworkEventType.OFFLINE, onOffline)
    }

    if (isNetworkInfoSupported) {
      const connection = getConnection()
      connection?.removeEventListener?.(NetworkEventType.CHANGE, onConnectionChange)
    }
  })

  return state
}
