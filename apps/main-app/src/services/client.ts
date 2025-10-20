import { generateMockStockList, getWholeData } from '@kynance/providers'

import { alovaInstance } from '@/infrastructure/utils/request.js'

import {
  LAST_10_DAYS,
  LAST_180_DAYS,
  LAST_1_DAYS,
  LAST_30_DAYS,
  LAST_365_DAYS,
} from './model/date.js'
import { searchList } from './model/searchList.js'
const Api = {
  dailyGainer: '/api/stocks/dailyGainer/:region',
  dailyLoser: '/api/stocks/dailyLoser/:region',
  day: '/api/stocks/:symbol/:day',
  watchList: '/api/stocks/watchList',
  searchList: '/api/stocks/searchList',
  company: '/api/companyInfo/00700',
  stocks: '/api/stocks',
}
export const getCsrfToken = async () => {
  try {
    const response = await fetch('https://api.kynance.cn:3000/api/csrf-token', {
      credentials: 'include', // 必须包含credentials才能接收cookie
    })
    const data = await response.json()
    return data.csrfToken
  } catch (error) {
    console.error('获取CSRF Token失败:', error)
    return ''
  }
}
export function getDailyLoser(region) {
  const url = Api.dailyLoser.replace(':region', region)
  return alovaInstance.Get(url)
}
export function getDailyGainer(region) {
  const url = Api.dailyGainer.replace(':region', region)
  return alovaInstance.Get(url)
}
export function getDayData(
  symbol,
  period,
  config = {
    basePrice: 480.2,
    volumeMax: 38200000,
    volumeMin: 10200000,
  },
) {
  let dateRange

  switch (period) {
    case '1d':
      dateRange = LAST_1_DAYS
      break
    case '10d':
      dateRange = LAST_10_DAYS
      break
    case '1m':
      dateRange = LAST_30_DAYS
      break
    case '6m':
      dateRange = LAST_180_DAYS
      break
    case '1y':
      dateRange = LAST_365_DAYS
      break
    default:
      throw new Error('Invalid period specified')
  }

  return {
    symbol,
    data: getWholeData(config, dateRange),
  }
}
export function getWatchList(data) {
  const list = generateMockStockList(data)
  return list
}
export function getSearchList() {
  return searchList
}
export function getCompanyInfo() {
  return alovaInstance.Get(Api.company)
}
export function getStocks(date) {
  return getWholeData(
    {
      basePrice: 480.2,
      volumeMax: 38200000,
      volumeMin: 10200000,
    },
    date,
  )
}
