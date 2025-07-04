import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/notification',
    component: Layout,
    redirect: '/notification/base',
    name: 'notification',
    meta: {
      title: {
        zh_CN: '通知',
        en_US: 'Notification',
      },
      icon: 'notification',
      orderNo: 0,
    },
    children: [
      {
        path: 'base',
        name: 'NotificationBase',
        component: () => import('@/pages/notification/base/index.vue'),
        meta: {
          title: {
            zh_CN: '通知',
            en_US: 'Notification',
          },
        },
      },
    ],
  },
]
