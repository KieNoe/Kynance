import { MoreIcon } from 'tdesign-icons-vue-next'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/other',
    component: Layout,
    redirect: '/other/sliding',
    name: 'other',
    meta: {
      title: {
        zh_CN: '更多',
        en_US: 'More',
      },
      icon: MoreIcon,
      orderNo: 0,
    },
    children: [
      {
        path: 'sliding',
        name: 'MoreSliding',
        component: () => import('@/pages/other/sliding/index.vue'),
        meta: {
          title: {
            zh_CN: '图表',
            en_US: 'Chart',
          },
        },
      },
      {
        path: 'recovery',
        name: 'crashRecovery',
        component: () => import('@/pages/fullBack/base/index.vue'),
        meta: {
          title: {
            zh_CN: '崩溃恢复页面',
            en_US: 'crash recovery page',
          },
        },
      },
      {
        path: 'ai-model',
        name: 'aiModel',
        component: () => import('@/pages/other/ai-display/index.vue'),
        meta: {
          title: {
            zh_CN: 'AI模型演示',
            en_US: 'AI model display',
          },
        },
      },
    ],
  },
]
