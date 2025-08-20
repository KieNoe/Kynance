import { CheckCircleIcon } from 'tdesign-icons-vue-next'

export default [
  {
    path: '/result',
    component: () => import('@/layouts/blank.vue'),
    redirect: '/result/success',
    name: 'result',
    meta: {
      title: {
        zh_CN: '结果',
        en_US: 'Result',
      },
      icon: CheckCircleIcon,
      orderNo: 0,
    },
    children: [
      {
        path: 'success',
        name: 'success',
        component: () => import('@/pages/result/success/index.vue'),
        meta: {
          title: {
            zh_CN: '成功',
            en_US: 'Success',
          },
        },
      },
      {
        path: 'fail',
        name: 'fail',
        component: () => import('@/pages/result/fail/index.vue'),
        meta: {
          title: {
            zh_CN: '失败',
            en_US: 'Fail',
          },
        },
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: () => import('@/pages/result/maintenance/index.vue'),
        meta: {
          title: {
            zh_CN: '维护',
            en_US: 'Maintenance',
          },
        },
      },
      {
        path: 'network-error',
        name: 'network-error',
        component: () => import('@/pages/result/network-error/index.vue'),
        meta: {
          title: {
            zh_CN: '网络错误',
            en_US: 'Network Error',
          },
        },
      },
      {
        path: 'browser-incompatible',
        name: 'browser-incompatible',
        component: () => import('@/pages/result/browser-incompatible/index.vue'),
        meta: {
          title: {
            zh_CN: '浏览器不兼容',
            en_US: 'browser-incompatible',
          },
        },
      },
      {
        path: '403',
        name: '403',
        component: () => import('@/pages/result/403/index.vue'),
        meta: {
          title: {
            zh_CN: '403',
            en_US: '403',
          },
        },
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/pages/result/404/index.vue'),
        meta: {
          title: {
            zh_CN: '404',
            en_US: '404',
          },
        },
      },
      {
        path: '500',
        name: '500',
        component: () => import('@/pages/result/500/index.vue'),
        meta: {
          title: {
            zh_CN: '500',
            en_US: '500',
          },
        },
      },
    ],
  },
]
