import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

// 本地存储的键名
const SORT_PLACE_KEY = 'kynance_sort_place'

interface StockDataItem {
  data?: any // 或者更具体的类型
  symbol?: any
}

export const useStockDataStore = defineStore('stockData', () => {
  const stockData = reactive({
    default: {} as StockDataItem,
    '1d': {} as StockDataItem,
    '10d': {} as StockDataItem,
    '1m': {} as StockDataItem,
    '6m': {} as StockDataItem,
    '1y': {} as StockDataItem,
  })

  const sortPlace = ref(getSavedSortPlace())

  function getSavedSortPlace() {
    try {
      const savedSortPlace = localStorage.getItem(SORT_PLACE_KEY)
      return savedSortPlace ? JSON.parse(savedSortPlace) : [1, 2, 3]
    } catch (error) {
      console.error('读取排序顺序失败:', error)
      return [1, 2, 3]
    }
  }

  function updateSortPlace(newSortPlace) {
    sortPlace.value = newSortPlace
    try {
      localStorage.setItem(SORT_PLACE_KEY, JSON.stringify(newSortPlace))
    } catch (error) {
      console.error('保存排序顺序失败:', error)
    }
  }

  const initStockData = async (getDayData) => {
    stockData['1m'] = await getDayData('0700', '1m')
    stockData['10d'] = stockData['1d'] = stockData['6m'] = stockData['1y'] = {}
    stockData['default'] = stockData['1m']
  }

  const updateStockData = async (data, getDayData) => {
    if (Object.keys(stockData[data]).length === 0) {
      stockData[data] = await getDayData('0700', data)
    }
    stockData.default = stockData[data]
  }

  return {
    stockData,
    initStockData,
    updateStockData,
    sortPlace,
    updateSortPlace,
  }
})
