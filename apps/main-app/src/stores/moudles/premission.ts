import { defineStore } from 'pinia'

export const getPermissionStore = defineStore('permission', () => {
  const whiteListRouters: string[] = ['/login']
  const getAsyncRoutes = async () => {
    const data = []
    return data
  }
  const restoreRoutes = () => {}
  return {
    whiteListRouters,
    getAsyncRoutes,
    restoreRoutes,
  }
})
