import { DashboardIcon } from 'tdesign-icons-vue-next'
import { shallowRef } from 'vue'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/watchlists',
    component: Layout,
    redirect: '/watchlists/base',
    name: 'watchlists',
    meta: {
      title: {
        zh_CN: '自选股管理',
        en_US: 'Watchlists',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'WatchlistBase',
        component: () => import('@/pages/watchlists/base/index.vue'),
        meta: {
          title: {
            zh_CN: '自选股管理',
            en_US: 'Watchlists',
          },
        },
      },
    ],
  },
]
