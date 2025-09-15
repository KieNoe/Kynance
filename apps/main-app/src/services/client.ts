import { generateMockStockList, getWholeData } from '@kynance/providers'
import dayjs from 'dayjs'

import { alovaInstance } from '@/infrastructure/utils/request.js'
const Api = {
  dailyGainer: '/api/stocks/dailyGainer/:region',
  dailyLoser: '/api/stocks/dailyLoser/:region',
  day: '/api/stocks/:symbol/:day',
  watchList: '/api/stocks/watchList',
  searchList: '/api/stocks/searchList',
  company: '/api/companyInfo/00700',
  stocks: '/api/stocks',
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
      dateRange = [
        dayjs().startOf('day').add(9, 'hour').add(30, 'minute').format('YYYY-MM-DD HH:mm'),
        dayjs().format('YYYY-MM-DD HH:mm'),
      ]
      break
    case '10d':
      dateRange = [
        dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      ]
      break
    case '1m':
      dateRange = [
        dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      ]
      break
    case '6m':
      dateRange = [
        dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      ]
      break
    case '1y':
      dateRange = [
        dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      ]
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
  return [
    { name: '腾讯控股', code: '07000.HK' },
    { name: '阿里巴巴', code: '09988.HK' },
    { name: '贵州茅台', code: '600519.SH' },
    { name: '美团', code: '03690.HK' },
    { name: '京东', code: '09618.HK' },
    { name: '拼多多', code: 'PDD.NASDAQ' },
    { name: '比亚迪', code: '002594.SZ' },
    { name: '宁德时代', code: '300750.SZ' },
    { name: '小米集团', code: '01810.HK' },
    { name: '中国平安', code: '601318.SH' },
    { name: '招商银行', code: '600036.SH' },
    { name: '药明康德', code: '603259.SH' },
    { name: '隆基绿能', code: '601012.SH' },
    { name: '海康威视', code: '002415.SZ' },
    { name: '伊利股份', code: '600887.SH' },
    { name: '苹果', code: 'AAPL.NASDAQ' },
    { name: '微软', code: 'MSFT.NASDAQ' },
    { name: '谷歌', code: 'GOOGL.NASDAQ' },
    { name: '亚马逊', code: 'AMZN.NASDAQ' },
    { name: '特斯拉', code: 'TSLA.NASDAQ' },
    { name: '英伟达', code: 'NVDA.NASDAQ' },
    { name: 'Meta', code: 'META.NASDAQ' },
    { name: '伯克希尔·哈撒韦', code: 'BRK.A.NYSE' },
    { name: '摩根大通', code: 'JPM.NYSE' },
    { name: '强生', code: 'JNJ.NYSE' },
    { name: '沃尔玛', code: 'WMT.NYSE' },
    { name: '宝洁', code: 'PG.NYSE' },
    { name: '埃克森美孚', code: 'XOM.NYSE' },
    { name: '可口可乐', code: 'KO.NYSE' },
    { name: '辉瑞', code: 'PFE.NYSE' },
    { name: '雀巢', code: 'NESN.SWX' },
    { name: '路威酩轩', code: 'MC.EPA' },
    { name: '阿斯麦', code: 'ASML.AMS' },
    { name: '西门子', code: 'SIE.ETR' },
    { name: 'SAP', code: 'SAP.ETR' },
    { name: '三星电子', code: '005930.KRX' },
    { name: '丰田汽车', code: '7203.TYO' },
    { name: '索尼', code: '6758.TYO' },
    { name: '台积电', code: '2330.TPE' },
    { name: '信实工业', code: 'RELIANCE.NSE' },
    { name: '必和必拓', code: 'BHP.ASX' },
    { name: '淡水河谷', code: 'VALE.NYSE' },
    { name: '沙特阿美', code: '2222.TADAWUL' },
  ]
  return alovaInstance.Get(Api.searchList)
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
