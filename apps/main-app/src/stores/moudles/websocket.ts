import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { io } from 'socket.io-client'

export const useWebSocketStore = defineStore('websocket', () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const messages = ref([])
  const connectionStatus = ref('未连接')

  const count = 0
  let reconnectTimer = null
  let reconnectAttempts = 0
  let heartbeatTimer = null
  let heartbeatFailCount = 0

  // 初始化WebSocket连接
  const initSocket = () => {
    // 连接到后端服务器
    socket.value = io('http://localhost:3001')

    // 连接成功
    socket.value.on('connect', () => {
      isConnected.value = true
      connectionStatus.value = '已连接'
      console.log('WebSocket连接成功')
      // 重置重连计数
      reconnectAttempts = 0
      // 启动心跳
      startHeartbeat()
    })

    // 接收服务器发送的消息
    socket.value.on('message', (data) => {
      console.log(data)
      messages.value.push(...data)

      // 限制消息数量，避免内存溢出
      if (messages.value.length > 100) {
        messages.value.shift()
      }
    })

    // 接收欢迎消息
    socket.value.on('welcome', (data) => {
      console.log('收到欢迎消息:', data)
    })

    socket.value.on('heartbeat', (data) => {
      console.log('收到心跳消息:', data)
      // 收到心跳响应,重置失败计数
      heartbeatFailCount = 0
    })

    // 连接断开
    socket.value.on('disconnect', () => {
      isConnected.value = false
      connectionStatus.value = '连接断开'
      console.log('WebSocket连接断开')
      // 触发指数退避重连
      reconnectWithBackoff()
    })

    // 连接错误
    socket.value.on('connect_error', (error) => {
      isConnected.value = false
      connectionStatus.value = '连接错误'
      console.error('WebSocket连接错误:', error)
      // 连接错误也触发指数退避重连
      reconnectWithBackoff()
    })
  }

  // 发送消息到服务器
  const sendMessage = (message) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('clientMessage', message)
    }
  }

  // 启动心跳定时器
  const startHeartbeat = () => {
    // 清除之前的心跳定时器
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
    }

    heartbeatTimer = setInterval(() => {
      // 发送心跳包
      if (socket.value && isConnected.value) {
        console.log('发送心跳包')
        sendMessage('heartbeat')
        heartbeatFailCount++

        // 3次无响应则触发重连
        if (heartbeatFailCount >= 3) {
          console.log('心跳连续3次无响应,触发重连')
          heartbeatFailCount = 0
          // 主动断开连接,触发disconnect事件进而触发重连
          disconnect()
          reconnectWithBackoff()
        }
      }
    }, 30000) // 30秒
  }

  // 停止心跳定时器
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    heartbeatFailCount = 0
  }

  const tryConnecting = () => {
    // 清除之前的重连定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    initSocket()
  }

  // 指数退避重连函数
  const reconnectWithBackoff = () => {
    // 计算重连间隔：1s → 2s → 4s (2的reconnectAttempts次方秒)
    const backoffDelay = Math.pow(2, reconnectAttempts) * 1000
    // 限制最大重连间隔为4秒
    const delay = Math.min(backoffDelay, 4000)

    console.log(`将在 ${delay / 1000}秒 后尝试第 ${reconnectAttempts + 1} 次重连`)

    reconnectTimer = setTimeout(() => {
      reconnectAttempts++
      initSocket()
    }, delay)
  }

  // 断开连接
  const disconnect = () => {
    // 停止心跳
    stopHeartbeat()

    if (socket.value) {
      socket.value.disconnect()
    }
    // 清除重连定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    // 重置重连计数
    reconnectAttempts = 0
  }

  // 清除消息历史
  const clearMessages = () => {
    messages.value = []
  }

  // 组件挂载时自动连接
  onMounted(() => {
    initSocket()
  })

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    messages,
    connectionStatus,
    disconnect,
    sendMessage,
    clearMessages,
    initSocket,
    tryConnecting,
  }
})
