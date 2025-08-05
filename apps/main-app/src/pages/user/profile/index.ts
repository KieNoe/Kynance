import { t } from '@/infrastructure/locales'
import { getStocks } from '@/services/client'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

export const USER_INFO_LIST = [
  {
    title: 'pages.user.personalInfo.desc.telephone',
    content: '+86 ' + userStore.user.telephone,
  },
  {
    title: 'pages.user.personalInfo.desc.identity',
    content:
      userStore.user.permission === 0
        ? t('pages.user.personalInfo.normal')
        : t('pages.user.personalInfo.admin'),
  },
  {
    title: 'pages.user.personalInfo.desc.email',
    content: userStore.user.email,
  },
  {
    title: 'pages.user.personalInfo.desc.seat',
    content: userStore.user.createdData,
  },
  {
    title: 'pages.user.personalInfo.desc.dayOfUse',
    content: userStore.user.usingTime + t('pages.user.day'),
  },
  {
    title: 'pages.user.personalInfo.desc.activeDay',
    content: userStore.user.activeTime + t('pages.user.day'),
  },
  {
    title: 'pages.user.personalInfo.desc.totalMoney',
    content: userStore.user.totalMoney,
  },
  {
    title: 'pages.user.personalInfo.desc.heldStocks',
    content: userStore.user.heldStocks.length,
  },
  {
    title: 'pages.user.personalInfo.desc.description',
    content: userStore.user.description,
  },
]
/**
 * 刷新用户信息列表
 * @param {object} userStore - 用户存储对象
 * @param {function} t - 翻译函数
 * @returns {Array} 更新后的用户信息列表
 */
export const refreshUserInfoList = (userStore, t) => {
  return [
    {
      title: 'pages.user.personalInfo.desc.telephone',
      content: '+86 ' + userStore.user.telephone,
    },
    {
      title: 'pages.user.personalInfo.desc.identity',
      content:
        userStore.user.permission === 0
          ? t('pages.user.personalInfo.normal')
          : t('pages.user.personalInfo.admin'),
    },
    {
      title: 'pages.user.personalInfo.desc.email',
      content: userStore.user.email,
    },
    {
      title: 'pages.user.personalInfo.desc.seat',
      content: userStore.user.createdData,
    },
    {
      title: 'pages.user.personalInfo.desc.dayOfUse',
      content: userStore.user.usingTime + t('pages.user.day'),
    },
    {
      title: 'pages.user.personalInfo.desc.activeDay',
      content: userStore.user.activeTime + t('pages.user.day'),
    },
    {
      title: 'pages.user.personalInfo.desc.totalMoney',
      content: userStore.user.totalMoney,
    },
    {
      title: 'pages.user.personalInfo.desc.heldStocks',
      content: userStore.user.heldStocks.length,
    },
    {
      title: 'pages.user.personalInfo.desc.description',
      content: userStore.user.description,
    },
  ]
}
export const WEBSITE_RECOMMEND = [
  {
    title: 'Github',
    logo: 'logo-github',
    description: t('pages.user.website.github'),
  },
  {
    title: 'Codepen',
    logo: 'logo-codepen',
    description: t('pages.user.website.codepen'),
  },
  {
    title: 'Gitlab',
    logo: 'logo-gitlab',
    description: t('pages.user.website.gitlab'),
  },
  {
    title: 'Figma',
    logo: 'logo-figma',
    description: t('pages.user.website.figma'),
  },
]
const stockData = {
  symbol: '0700',
  data: [
    { date: '2025-06-23', open: 480.2, high: 485.8, low: 478.5, close: 484.1, volume: 18200000 },
    { date: '2025-06-24', open: 484.3, high: 490.5, low: 483.0, close: 489.2, volume: 19500000 },
    { date: '2025-06-25', open: 489.5, high: 492.0, low: 487.8, close: 490.1, volume: 17800000 },
    { date: '2025-06-26', open: 490.3, high: 493.2, low: 488.5, close: 491.5, volume: 16500000 },
    { date: '2025-06-27', open: 491.8, high: 494.0, low: 490.0, close: 492.2, volume: 15800000 },
    { date: '2025-06-28', open: 492.0, high: 492.5, low: 485.0, close: 487.3, volume: 20100000 },
    { date: '2025-06-29', open: 487.0, high: 488.2, low: 480.5, close: 482.1, volume: 21400000 },
    { date: '2025-06-30', open: 481.8, high: 484.0, low: 479.2, close: 480.5, volume: 19800000 },
    { date: '2025-07-01', open: 480.3, high: 482.5, low: 477.0, close: 478.8, volume: 18500000 },
    { date: '2025-07-02', open: 478.5, high: 479.0, low: 473.2, close: 475.1, volume: 22300000 },
    { date: '2025-07-03', open: 475.0, high: 476.8, low: 471.5, close: 473.2, volume: 20900000 },
    { date: '2025-07-04', open: 473.0, high: 478.5, low: 472.8, close: 476.5, volume: 17600000 },
    { date: '2025-07-05', open: 476.8, high: 482.0, low: 476.0, close: 480.2, volume: 19100000 },
    { date: '2025-07-06', open: 480.5, high: 485.3, low: 479.8, close: 483.8, volume: 21000000 },
    { date: '2025-07-07', open: 484.0, high: 484.5, low: 478.0, close: 480.1, volume: 23500000 },
    { date: '2025-07-08', open: 480.0, high: 481.2, low: 475.5, close: 477.3, volume: 22800000 },
    { date: '2025-07-09', open: 477.0, high: 477.8, low: 473.0, close: 474.5, volume: 20500000 },
    { date: '2025-07-10', open: 474.3, high: 475.0, low: 470.2, close: 472.1, volume: 18800000 },
    { date: '2025-07-11', open: 472.0, high: 473.5, low: 469.8, close: 471.0, volume: 17200000 },
    { date: '2025-07-12', open: 470.8, high: 471.5, low: 468.0, close: 469.5, volume: 16500000 },
    { date: '2025-07-13', open: 469.3, high: 475.0, low: 469.0, close: 473.8, volume: 19400000 },
    { date: '2025-07-14', open: 474.0, high: 482.6, low: 473.5, close: 480.1, volume: 23800000 },
    { date: '2025-07-15', open: 480.5, high: 495.0, low: 479.8, close: 492.3, volume: 28500000 },
    { date: '2025-07-16', open: 492.5, high: 502.8, low: 491.0, close: 498.6, volume: 31200000 },
    { date: '2025-07-17', open: 498.8, high: 505.0, low: 497.5, close: 503.1, volume: 29700000 },
    { date: '2025-07-18', open: 503.5, high: 506.2, low: 501.8, close: 504.5, volume: 25400000 },
    { date: '2025-07-19', open: 504.8, high: 507.0, low: 503.0, close: 505.2, volume: 21800000 },
    { date: '2025-07-20', open: 505.0, high: 512.5, low: 504.2, close: 510.8, volume: 24600000 },
    { date: '2025-07-21', open: 511.0, high: 520.3, low: 510.5, close: 518.2, volume: 27300000 },
    { date: '2025-07-22', open: 521.5, high: 525.5, low: 519.0, close: 521.46, volume: 16414000 },
  ],
}
export async function getStockData(date) {
  return getStocks(date)
}
export const getOptions = (stockData) => {
  return {
    xAxis: [
      {
        data: stockData.map((item) => item.date),
        type: 'category',
        axisLabel: {
          interval: Math.floor(stockData.length / 4), // 计算间隔使只显示4-5个标签
        },
      },
    ],
    tooltip: [
      {
        trigger: 'axis',
        formatter: function (params) {
          const data = params[0].data
          return `
        <div><strong>盈利$${data.close}万</strong></div>
        <div>${params[0].axisValueLabel}</div>
      `
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '股价',
        data: stockData.map((item) => ({
          value: item.close,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        })),
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#5470C6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(84, 112, 198, 0.5)',
              },
              {
                offset: 1,
                color: 'rgba(84, 112, 198, 0.1)',
              },
            ],
          },
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
  }
}
