import { DashboardIcon } from 'tdesign-icons-vue-next'
import { shallowRef } from 'vue'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/market',
    component: Layout,
    redirect: '/market/base',
    name: 'market',
    meta: {
      title: {
        zh_CN: '市场',
        en_US: 'Market',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'futures',
        name: 'MarketFutures',
        component: () => import('@/pages/market/futures/index.vue'),
        meta: {
          title: {
            zh_CN: '期货',
            en_US: 'Futures',
          },
        },
      },
      {
        path: 'stocks',
        name: 'MarketStocks',
        component: () => import('@/pages/market/stocks/index.vue'),
        meta: {
          title: {
            zh_CN: '股票',
            en_US: 'Stocks',
          },
        },
      },
      {
        path: 'indices',
        name: 'MarketIndices',
        component: () => import('@/pages/market/indices/index.vue'),
        meta: {
          title: {
            zh_CN: '指数',
            en_US: 'Indices',
          },
        },
      },
    ],
  },
]
