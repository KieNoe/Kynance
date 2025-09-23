export interface WebSocketMessage {
  type: string
  data?: any
  timestamp?: number
}

export interface WebSocketOptions {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  heartbeatMessage?: WebSocketMessage
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onReconnect?: (attempt: number) => void
}

export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts: number = 0
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private isManualClose: boolean = false
  private messageListeners: Array<(message: WebSocketMessage) => void> = []

  private defaultOptions: Partial<WebSocketOptions> = {
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
    heartbeatMessage: {
      type: 'heartbeat',
      timestamp: Date.now(),
    },
  }

  private options: WebSocketOptions

  constructor(options: WebSocketOptions) {
    this.options = { ...this.defaultOptions, ...options }
    this.connect()
  }

  /**
   * 连接到WebSocket服务器
   */
  public connect(): void {
    if (this.ws && this.ws.readyState === WebSocketState.OPEN) {
      console.warn('WebSocket is already connected')
      return
    }

    this.isManualClose = false

    try {
      this.ws = new WebSocket(this.options.url)
      this.setupEventListeners()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.handleReconnection()
    }
  }

  /**
   * 设置WebSocket事件监听器
   */
  private setupEventListeners(): void {
    if (!this.ws) return

    this.ws.onopen = (event: Event) => {
      console.log('WebSocket connected successfully')
      this.reconnectAttempts = 0

      this.startHeartbeat()

      if (this.options.onOpen) {
        this.options.onOpen(event)
      }
    }

    this.ws.onclose = (event: CloseEvent) => {
      console.log('WebSocket connection closed', event.code, event.reason)

      this.stopHeartbeat()

      if (this.options.onClose) {
        this.options.onClose(event)
      }

      if (!this.isManualClose) {
        this.handleReconnection()
      }
    }

    this.ws.onerror = (event: Event) => {
      console.error('WebSocket error occurred:', event)

      if (this.options.onError) {
        this.options.onError(event)
      }
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)

        this.messageListeners.forEach((listener) => listener(message))

        if (this.options.onMessage) {
          this.options.onMessage(message)
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error, event.data)
      }
    }
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnection(): void {
    if (this.isManualClose) return

    if (this.reconnectAttempts < (this.options.maxReconnectAttempts || 5)) {
      this.reconnectAttempts++

      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})...`,
      )

      if (this.options.onReconnect) {
        this.options.onReconnect(this.reconnectAttempts)
      }

      this.reconnectTimer = window.setTimeout(() => {
        this.connect()
      }, this.options.reconnectInterval)
    } else {
      console.error('Maximum reconnection attempts reached')
    }
  }

  /**
   * 启动心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocketState.OPEN) {
        this.send(this.options.heartbeatMessage!)
      }
    }, this.options.heartbeatInterval)
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 发送消息
   */
  public send(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocketState.OPEN) {
      console.error('WebSocket is not connected')
      return false
    }

    try {
      const messageWithTimestamp = {
        ...message,
        timestamp: Date.now(),
      }

      this.ws.send(JSON.stringify(messageWithTimestamp))
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }

  /**
   * 关闭连接
   */
  public close(code?: number, reason?: string): void {
    this.isManualClose = true
    this.stopHeartbeat()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close(code, reason)
      this.ws = null
    }
  }

  /**
   * 添加消息监听器
   */
  public addMessageListener(listener: (message: WebSocketMessage) => void): void {
    this.messageListeners.push(listener)
  }

  /**
   * 移除消息监听器
   */
  public removeMessageListener(listener: (message: WebSocketMessage) => void): void {
    const index = this.messageListeners.indexOf(listener)
    if (index > -1) {
      this.messageListeners.splice(index, 1)
    }
  }

  /**
   * 获取当前连接状态
   */
  public getState(): WebSocketState {
    return this.ws ? this.ws.readyState : WebSocketState.CLOSED
  }

  /**
   * 检查是否已连接
   */
  public isConnected(): boolean {
    return this.ws ? this.ws.readyState === WebSocketState.OPEN : false
  }

  /**
   * 获取重连尝试次数
   */
  public getReconnectAttempts(): number {
    return this.reconnectAttempts
  }
}

// 创建WebSocket单例
let websocketInstance: WebSocketService | null = null

export const useWebSocket = (options?: WebSocketOptions): WebSocketService => {
  if (!websocketInstance && options) {
    websocketInstance = new WebSocketService(options)
  }

  if (!websocketInstance) {
    throw new Error(
      'WebSocket instance not initialized. Please provide options when calling useWebSocket for the first time.',
    )
  }

  return websocketInstance
}

export default WebSocketService
//使用示例
// import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
// import { useWebSocket, WebSocketMessage } from '@/infrastructure/utils/useWebSocket.ts';

// export default defineComponent({
//   name: 'WebSocketDemo',
//   setup() {
//     const message = ref('');
//     const messages = ref<string[]>([]);
//     const isConnected = ref(false);

//     // 初始化WebSocket
//     const ws = useWebSocket({
//       url: 'wss://echo.websocket.org',
//       onOpen: (event) => {
//         console.log('Connected to WebSocket server');
//         isConnected.value = true;
//       },
//       onClose: (event) => {
//         console.log('Disconnected from WebSocket server');
//         isConnected.value = false;
//       },
//       onMessage: (message: WebSocketMessage) => {
//         console.log('Received message:', message);
//         if (message.type !== 'heartbeat') {
//           messages.value.push(`Received: ${JSON.stringify(message)}`);
//         }
//       },
//       onReconnect: (attempt) => {
//         console.log(`Reconnection attempt ${attempt}`);
//       }
//     });

//     // 发送消息
//     const sendMessage = () => {
//       if (message.value.trim()) {
//         const wsMessage: WebSocketMessage = {
//           type: 'message',
//           data: message.value
//         };

//         if (ws.send(wsMessage)) {
//           messages.value.push(`Sent: ${message.value}`);
//           message.value = '';
//         }
//       }
//     };

//     // 组件挂载时添加消息监听器
//     onMounted(() => {
//       ws.addMessageListener((msg: WebSocketMessage) => {
//         if (msg.type === 'custom') {
//           console.log('Custom message received:', msg);
//         }
//       });
//     });

//     // 组件卸载时清理
//     onUnmounted(() => {
//       // 可以根据需要决定是否关闭连接
//       // ws.close();
//     });

//     return {
//       message,
//       messages,
//       isConnected,
//       sendMessage
//     };
//   }
// });
