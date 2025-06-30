import { defineStore } from 'pinia'
import type { UserInfo } from '@kynance/types'

export const useUserStore = defineStore('user', () => {
  const user: UserInfo = {
    name: 'admin',
    id: '',
    avatar: '',
    token: '1',
    permission: 0,
    email: '',
  }
  const getUser: () => UserInfo = () => {
    return user
  }
  const logout: () => void = () => {
    user.token = ''
    user.permission = 0
    user.name = ''
    user.id = ''
    user.avatar = ''
    user.email = ''
  }
  return {
    user,
    getUser,
    logout,
  }
})
