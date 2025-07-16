import { alovaInstance } from '@/infrastructure/utils/request'

const Api = {
  history: '/api/stock/history',
  quote: '/api/stock/quote',
  search: '/api/stock/search',
  marketSummary: '/api/stock/marketSummary',
  dailyGainer: './api/stock/dailyGainer',
  dailyLoser: './api/stock/dailyLoser',
  trendingSymbols: './api/stock/trendingSymbols',
  screener_aggressive_small_caps: './api/stock/screener/aggressive_small_caps',
  insights_AYX: './api/stock/insights/AYX',
}

export function getHistory(symbol) {
  return alovaInstance.Post(Api.history, {
    params: {
      symbol,
    },
  })
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

export function getDailyLoser() {
  return alovaInstance.Get(Api.dailyLoser)
}
export function getTrendingSymbols() {
  return alovaInstance.Get(Api.trendingSymbols)
}
export function getScreenerAggressiveSmallCaps() {
  return alovaInstance.Get(Api.screener_aggressive_small_caps)
}
export function getDailyGainer() {
  return alovaInstance.Get(Api.dailyGainer)
}
export function getInsightsAYX() {
  return alovaInstance.Get(Api.insights_AYX)
}
