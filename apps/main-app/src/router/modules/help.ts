import { HelpCircleIcon } from 'tdesign-icons-vue-next'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/help',
    component: Layout,
    redirect: '/help/base',
    name: 'help',
    meta: {
      title: {
        zh_CN: '帮助',
        en_US: 'Help',
      },
      icon: HelpCircleIcon,
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'HelpBase',
        component: () => import('@/pages/help/base/index.vue'),
        meta: {
          title: {
            zh_CN: 'FAQ',
            en_US: 'FAQ',
          },
        },
      },
    ],
  },
]
