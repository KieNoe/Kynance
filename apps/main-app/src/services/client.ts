import { alovaInstance } from '@/infrastructure/utils/request'

const Api = {
  history: '/api/stock/history',
  quote: '/api/stock/quote',
  search: '/api/stock/search',
  marketSummary: '/api/stock/marketSummary',
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
