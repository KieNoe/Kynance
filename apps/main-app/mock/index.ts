import Mock from 'mockjs'
import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/stock/history',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        data: [
          {
            date: '2023-01-09T00:00:00.000Z',
            open: 130.27999877929688,
            high: 130.89999389648438,
            low: 124.16999816894531,
            close: 125.06999969482422,
            adjClose: 125.06999969482422,
            volume: 112117500,
            symbol: 'AAPL',
          },
          {
            date: '2023-01-06T00:00:00.000Z',
            open: 127.98999786376953,
            high: 130.47999572753906,
            low: 127.7300033569336,
            close: 129.6199951171875,
            adjClose: 129.6199951171875,
            volume: 87754500,
            symbol: 'AAPL',
          },
          // 更多日期数据...
        ],
      }
    },
  },
  {
    url: '/api/stock/quote',
    method: 'get',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        data: {
          symbol: 'AAPL',
          currency: 'USD',
          regularMarketPrice: 193.58,
          regularMarketChange: -1.2299957,
          regularMarketChangePercent: -0.63124394,
          regularMarketTime: '2025-07-11T19:59:59.000Z',
          marketState: 'CLOSED',
          longName: 'Apple Inc.',
          exchange: 'NASDAQ',
          regularMarketDayHigh: 195.83,
          regularMarketDayLow: 193.18,
          regularMarketVolume: 48745800,
          trailingPE: 33.56,
        },
      }
    },
  },
  {
    url: '/api/stock/search',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        data: {
          quotes: [
            {
              symbol: 'TSLA',
              shortname: 'Tesla, Inc.',
              longname: 'Tesla, Inc.',
              exchange: 'NASDAQ',
              type: 'EQUITY',
            },
            {
              symbol: 'TL0.DE',
              shortname: 'TESLA INC. DL -,001',
              longname: 'Tesla, Inc.',
              exchange: 'GER',
              type: 'EQUITY',
            },
            // 更多相关结果...
          ],
          news: [], // 可能包含相关新闻
        },
      }
    },
  },
  {
    url: '/api/stock/marketSummary',
    method: 'get',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        data: [
          {
            symbol: '^GSPC',
            name: 'S&P 500',
            price: 5501.38,
            change: 12.71,
            percentChange: 0.23,
            exchange: 'SNP',
          },
          {
            symbol: '^IXIC',
            name: 'Nasdaq',
            price: 17857.02,
            change: 42.51,
            percentChange: 0.24,
            exchange: 'NASDAQ',
          },
          // 其他指数数据...
        ],
      }
    },
  },
] as MockMethod[]
