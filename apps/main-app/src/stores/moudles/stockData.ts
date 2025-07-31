import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useStockDataStore = defineStore('stockData', () => {
  const stockData = reactive({
    default: {},
    '1d': {},
    '10d': {},
    '1m': {},
    '6m': {},
    '1y': {},
  })
  const init = async (getDayData) => {
    stockData['1m'] = await getDayData('0700', '1m')
    stockData['10d'] = stockData['1d'] = stockData['6m'] = stockData['1y'] = {}
    stockData['default'] = stockData['1m']
  }
  const update = async (data, getDayData) => {
    if (Object.keys(stockData[data]).length === 0) {
      stockData[data] = await getDayData('0700', data)
    }
    stockData.default = stockData[data]
  }
  return { stockData, init, update }
})
