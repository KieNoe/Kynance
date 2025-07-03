import { defineStore } from 'pinia'
import type { UserInfo } from '@kynance/types'

// 定义存储的键名
const USER_STORAGE_KEY = 'user_store'

export const useUserStore = defineStore('user', () => {
  // 从本地存储初始化用户数据，如果没有则使用默认值
  const initialUser = (): UserInfo => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    return storedUser
      ? JSON.parse(storedUser)
      : {
          name: 'admin',
          id: '',
          avatar: '',
          token: '1',
          permission: 0,
          email: '',
        }
  }

  const user: UserInfo = initialUser()

  // 保存用户数据到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }

  const getUser: () => UserInfo = () => {
    return user
  }

  const setUser: <K extends keyof UserInfo>(key: K, value: UserInfo[K]) => void = (key, value) => {
    user[key] = value
    saveToLocalStorage() // 修改后自动保存
  }

  const logout: () => void = () => {
    user.token = ''
    user.permission = 0
    user.name = ''
    user.id = ''
    user.avatar = ''
    user.email = ''
    saveToLocalStorage() // 登出时保存状态
  }

  // 添加一个方法来手动清除持久化存储
  const clearStorage = () => {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
  return {
    user,
    getUser,
    logout,
    clearStorage,
    setUser,
  }
})
