import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/backtest',
    component: Layout,
    redirect: '/backtest/new',
    name: 'backtest',
    meta: {
      title: {
        zh_CN: '回测',
        en_US: 'Backtest',
      },
      icon: 'chart-line',
      orderNo: 0,
    },
    children: [
      {
        path: 'history',
        name: 'BacktestHistory',
        component: () => import('@/pages/backtest/history/index.vue'),
        meta: {
          title: {
            zh_CN: '历史回测',
            en_US: 'Backtest History',
          },
        },
      },
      {
        path: 'new',
        name: 'BacktestNew',
        component: () => import('@/pages/backtest/new/index.vue'),
        meta: {
          title: {
            zh_CN: '新回测',
            en_US: 'Backtest New',
          },
        },
      },
      {
        path: 'template',
        name: 'BacktestTemplate',
        component: () => import('@/pages/backtest/template/index.vue'),
        meta: {
          title: {
            zh_CN: '策略回测',
            en_US: 'Backtest Template',
          },
        },
      },
    ],
  },
]
