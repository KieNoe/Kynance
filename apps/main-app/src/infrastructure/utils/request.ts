import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { useUserStore } from '@/stores'

const isDevelopment = import.meta.env.VITE_ENV === 'development'

const userStore = useUserStore()

export const alovaInstance = createAlova({
  baseURL: isDevelopment ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BACKEND_URL,
  timeout: 10 * 1000,
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  shareRequest: false,
  cacheFor: {
    GET: 0,
    POST: {
      mode: 'restore',
      expire: 60 * 10 * 1000,
    },
    PUT: 0,
    DELETE: 0,
    HEAD: 60 * 10 * 1000,
  },
  beforeRequest(method) {
    method.config.headers = {
      'Content-Type': 'application/json',
    }
    method.config.mode = 'cors'
    if (method.meta?.requireToken) {
      method.config.headers = {
        ...method.config.headers, // 保留原有的请求头
        Authorization: `Bearer ${userStore.user.token}`, // 添加 Authorization header
      }
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      if (response.status >= 400) {
        MessagePlugin.error(String(response.status), 1500)
      }
      const json = await response.json()
      if (json.code !== 200) {
        MessagePlugin.error(json.message, 1500)
      }
      return json.data
    },
    onError: (error) => {
      MessagePlugin.error(error.message, 1500)
      return error
    },
    onComplete: (response) => {
      return response
    },
  },
})

export const cancelRequest = (alova) => {
  alova.abort()
}
