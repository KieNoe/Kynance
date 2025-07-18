import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/market',
    component: Layout,
    redirect: '/market/base',
    name: 'market',
    meta: {
      title: {
        zh_CN: '市场行情',
        en_US: 'Market',
      },
      icon: 'earth',
      orderNo: 0,
    },
    children: [
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
    ],
  },
]
