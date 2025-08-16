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
