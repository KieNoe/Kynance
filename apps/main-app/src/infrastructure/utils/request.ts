import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { MessagePlugin } from 'tdesign-vue-next'

const isDevelopment = import.meta.env.MODE === 'development'

export const alovaInstance = createAlova({
  baseURL: isDevelopment ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BACKEND_URL,
  timeout: 10 * 1000,
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  shareRequest: false,
  cacheFor: {
    GET: 0,
    POST: 0,
    PUT: 0,
    DELETE: 0,
    HEAD: 60 * 10 * 1000,
  },
  beforeRequest(method) {
    if (method.config.headers['noCache']) {
      method.meta = {
        ...method.meta,
        cacheFor: 0,
      }
      delete method.config.headers['noCache']
    }
    method.config.headers = {
      'Content-Type': 'application/json',
    }
  },
  responded: {
    onSuccess: async (response) => {
      if ((response as any).status >= 400) {
        MessagePlugin.error(String((response as any).status), 1500)
      }
      const json = await (response as any).json()
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
