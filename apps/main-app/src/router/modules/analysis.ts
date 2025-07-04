import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/base',
    name: 'analysis',
    meta: {
      title: {
        zh_CN: '分析',
        en_US: 'Analysis',
      },
      icon: 'setting-1',
      orderNo: 0,
    },
    children: [
      {
        path: 'custom',
        name: 'AnalysisCustom',
        component: () => import('@/pages/analysis/custom/index.vue'),
        meta: {
          title: {
            zh_CN: '自定义分析',
            en_US: 'Custom Analysis',
          },
        },
      },
      {
        path: 'technical',
        name: 'AnalysisTechnical',
        component: () => import('@/pages/analysis/technical/index.vue'),
        meta: {
          title: {
            zh_CN: '技术分析',
            en_US: 'Technical Analysis',
          },
        },
      },
      {
        path: 'fundamental',
        name: 'AnalysisFundamental',
        component: () => import('@/pages/analysis/fundamental/index.vue'),
        meta: {
          title: {
            zh_CN: '基本面分析',
            en_US: 'Fundamental Analysis',
          },
        },
      },
    ],
  },
]
