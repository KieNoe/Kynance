import { useUserStore } from '@/stores'
import { t } from '@/infrastructure/locales'
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
export const PROFIT_OPTION = {
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E'],
    type: 'category',
  },
  tooltip: {
    trigger: 'axis',
  },
  yAxis: {},
  series: [
    {
      data: [10, 22, 28, 43, 49],
      type: 'line',
    },
  ],
}
