import { alovaInstance } from '@/infrastructure/utils/request'

const Api = {
  history: '/api/stock/history',
  quote: '/api/stock/quote',
  search: '/api/stock/search',
  marketSummary: '/api/stock/marketSummary',
  dailyGainer: './api/stock/dailyGainer/:region',
  dailyLoser: './api/stock/dailyLoser/:region',
  trendingSymbols: './api/stock/trendingSymbols',
  screener_aggressive_small_caps: './api/stock/screener/aggressive_small_caps',
  insights_AYX: './api/stock/insights/AYX',
}

export function getHistory(symbol) {
  return alovaInstance.Post(Api.history)
}

export function getQuote(symbol) {
  return alovaInstance.Get(Api.quote, {
    params: {
      symbol,
    },
  })
}

export function getSearch(keyword) {
  return alovaInstance.Post(Api.search, {
    params: {
      keyword,
    },
  })
}

export function getMarketSummary() {
  return alovaInstance.Get(Api.marketSummary)
}

export function getDailyLoser(region) {
  const url = Api.dailyLoser.replace(':region', region)
  return alovaInstance.Get(url)
}
export function getTrendingSymbols() {
  return alovaInstance.Get(Api.trendingSymbols)
}
export function getScreenerAggressiveSmallCaps() {
  return alovaInstance.Get(Api.screener_aggressive_small_caps)
}
export function getDailyGainer(region) {
  const url = Api.dailyGainer.replace(':region', region)
  return alovaInstance.Get(url)
}
export function getInsightsAYX() {
  return alovaInstance.Get(Api.insights_AYX)
}
