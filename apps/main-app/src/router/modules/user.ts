import { LogoutIcon } from 'tdesign-icons-vue-next'
import { shallowRef } from 'vue'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/data',
    meta: { title: { zh_CN: '个人中心', en_US: 'User Center' }, icon: 'user-circle' },
    children: [
      {
        path: 'data',
        name: 'UserData',
        component: () => import('@/pages/user/data/index.vue'),
        meta: { title: { zh_CN: '个人数据', en_US: 'User Data' } },
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/pages/user/profile/index.vue'),
        meta: { title: { zh_CN: '个人资料', en_US: 'User Profile' } },
      },
      {
        path: 'preferences',
        name: 'UserPreferences',
        component: () => import('@/pages/user/preferences/index.vue'),
        meta: { title: { zh_CN: '个人偏好', en_US: 'User Preferences' } },
      },
    ],
  },
  {
    path: '/loginRedirect',
    name: 'loginRedirect',
    redirect: '/login',
    meta: { title: { zh_CN: '登录页', en_US: 'Login' }, icon: shallowRef(LogoutIcon) },
    component: () => import('../../layouts/blank.vue'),
    children: [
      {
        path: 'index',
        redirect: '/login',
        component: () => import('@/pages/login/index.vue'),
        meta: { title: { zh_CN: '登录页', en_US: 'Login' } },
      },
    ],
  },
]
