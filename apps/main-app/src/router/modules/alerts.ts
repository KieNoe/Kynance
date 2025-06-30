import { DashboardIcon } from 'tdesign-icons-vue-next'
import { shallowRef } from 'vue'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/alerts',
    component: Layout,
    redirect: '/alerts/base',
    name: 'alerts',
    meta: {
      title: {
        zh_CN: '告警',
        en_US: 'Alerts',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'AlertBase',
        component: () => import('@/pages/alerts/base/index.vue'),
        meta: {
          title: {
            zh_CN: '告警',
            en_US: 'Alerts',
          },
        },
      },
    ],
  },
]
