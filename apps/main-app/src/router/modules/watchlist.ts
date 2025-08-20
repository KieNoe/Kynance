import { StarIcon } from 'tdesign-icons-vue-next'

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
      icon: StarIcon,
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
