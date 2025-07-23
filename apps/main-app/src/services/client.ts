import { alovaInstance } from '@/infrastructure/utils/request'

const Api = {
  dailyGainer: '/api/stocks/dailyGainer/:region',
  dailyLoser: '/api/stocks/dailyLoser/:region',
  day: '/api/stocks/:symbol/:day',
}

export function getDailyLoser(region) {
  const url = Api.dailyLoser.replace(':region', region)
  return alovaInstance.Get(url)
}
export function getDailyGainer(region) {
  const url = Api.dailyGainer.replace(':region', region)
  return alovaInstance.Get(url)
}
export function getDayData(symbol, day) {
  const url = Api.day.replace(':symbol', symbol).replace(':day', day)
  return alovaInstance.Get(url)
}
