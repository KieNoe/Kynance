import { DashboardIcon } from 'tdesign-icons-vue-next'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: {
      title: {
        zh_CN: '仪表盘',
        en_US: 'Dashboard',
      },
      icon: DashboardIcon,
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'DashboardBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: {
          title: {
            zh_CN: '仪表盘概述',
            en_US: 'DashboardBase',
          },
        },
      },
    ],
  },
]
