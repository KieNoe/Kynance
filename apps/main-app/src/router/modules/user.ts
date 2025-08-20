import { UserCircleIcon } from 'tdesign-icons-vue-next'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/profile',
    meta: { title: { zh_CN: '个人中心', en_US: 'User Center' }, icon: UserCircleIcon },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/pages/user/profile/index.vue'),
        meta: { title: { zh_CN: '个人中心', en_US: 'User Center' } },
      },
    ],
  },
  {
    path: '/loginRedirect',
    name: 'loginRedirect',
    redirect: '/login',
    meta: { title: { zh_CN: '登录页', en_US: 'Login' }, icon: UserCircleIcon },
    component: () => import('@/layouts/blank.vue'),
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
