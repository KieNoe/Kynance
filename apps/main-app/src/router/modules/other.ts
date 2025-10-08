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
    ],
  },
]
