import { StockInfo } from '@kynance/types'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

// 本地存储的键名
const STORAGE_KEY = 'kynance-watchlist'

// 使用组合式API定义自选股列表store
export const useWatchListStore = defineStore('watchList', () => {
  // 状态
  const currentStock = ref<StockInfo | null>(null)
  const currentStockCode = ref('')
  const stocks = ref<StockInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const stockCount = computed(() => stocks.value.length)

  const topGainer = computed(() => {
    if (stocks.value.length === 0) return null
    return [...stocks.value].sort((a, b) => b.changePercent - a.changePercent)[0]
  })

  const topLoser = computed(() => {
    if (stocks.value.length === 0) return null
    return [...stocks.value].sort((a, b) => a.changePercent - b.changePercent)[0]
  })

  const getStockByCode = (code: string) => {
    return stocks.value.find((stock) => stock.code === code) || null
  }

  // 本地存储方法
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks.value))
    } catch (err) {
      console.error('保存自选股到本地存储失败:', err)
    }
  }

  function loadFromLocalStorage(): StockInfo[] {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY)
      if (storedData) {
        return JSON.parse(storedData)
      }
    } catch (err) {
      console.error('从本地存储加载自选股失败:', err)
    }
    return []
  }

  // 监听股票列表变化，自动保存到本地存储
  watch(
    stocks,
    () => {
      saveToLocalStorage()
    },
    { deep: true },
  )

  // 方法
  function setCurrentStock(stock: StockInfo | null) {
    currentStock.value = stock
  }

  function setCurrentStockCode(code: string) {
    currentStockCode.value = code
  }

  function addStock(stock: StockInfo) {
    // 检查是否已存在
    const exists = stocks.value.some((s) => s.code === stock.code)
    if (!exists) {
      stocks.value.push({
        ...stock,
        isSelected: true,
      })
      saveToLocalStorage() // 添加后保存
      return true
    }
    return false
  }

  function removeStock(code: string) {
    const index = stocks.value.findIndex((stock) => stock.code === code)
    if (index !== -1) {
      stocks.value.splice(index, 1)

      // 如果移除的是当前选中的股票，则清空当前选中
      if (currentStock.value && currentStock.value.code === code) {
        currentStock.value = null
      }

      saveToLocalStorage() // 移除后保存
    }
  }

  function addStocks(newStocks: StockInfo[]) {
    const filteredStocks = newStocks
      .filter((stock) => !stocks.value.some((s) => s.code === stock.code))
      .map((stock) => ({
        ...stock,
        isSelected: true,
      }))

    stocks.value.push(...filteredStocks)

    if (filteredStocks.length > 0) {
      saveToLocalStorage() // 批量添加后保存
    }
  }

  async function fetchWatchlist(Get) {
    loading.value = true
    error.value = null

    try {
      // 先尝试从本地存储加载
      const localStocks = loadFromLocalStorage()

      if (localStocks.length > 0) {
        stocks.value = localStocks
      } else {
        // 如果本地没有数据，则从服务器获取
        const mockData: any = [
          {
            id: 'stock_1754112865248_261',
            code: '00700.HK',
            name: '腾讯控股',
            price: 337.64,
            change: -1.16,
            changePercent: -0.34,
            volume: 9081233,
            turnover: 3066187510.12,
            marketCap: 24816787478.01,
            pe: 19.25,
            pb: 2.26,
            isSelected: false,
          },
          {
            id: 'stock_1754112865248_158',
            code: '09988.HK',
            name: '阿里巴巴',
            price: 828.47,
            change: 0.18,
            changePercent: 0.02,
            volume: 2963359,
            turnover: 2455054030.73,
            marketCap: 13021052482.42,
            pe: 30.44,
            pb: 8.97,
            isSelected: false,
          },
          {
            id: 'stock_1754112865248_788',
            code: '600519.SH',
            name: '贵州茅台',
            price: 414.25,
            change: 4.75,
            changePercent: 1.16,
            volume: 2503432,
            turnover: 1037046706,
            marketCap: 46706038552.75,
            pe: 48.2,
            pb: 9.46,
            isSelected: false,
          },
        ]

        stocks.value = mockData.map((stock) => ({
          ...stock,
          isSelected: true,
        }))

        // 保存初始数据到本地
        saveToLocalStorage()
      }

      stocks.value = await Get(stocks.value)

      // 默认选中第一个
      if (stocks.value.length > 0 && !currentStock.value) {
        currentStock.value = stocks.value[0]
      }
    } catch (err) {
      error.value = '加载自选股失败，请稍后重试'
      console.error('Failed to fetch watchlist:', err)
    } finally {
      loading.value = false
    }
  }

  function updateStockInfo(code: string, data: Partial<StockInfo>) {
    const index = stocks.value.findIndex((stock) => stock.code === code)
    if (index !== -1) {
      stocks.value[index] = {
        ...stocks.value[index],
        ...data,
      }

      // 如果更新的是当前选中的股票，也更新currentStock
      if (currentStock.value && currentStock.value.code === code) {
        currentStock.value = stocks.value[index]
      }

      saveToLocalStorage() // 更新后保存
    }
  }

  function clearWatchlist() {
    stocks.value = []
    currentStock.value = null
    saveToLocalStorage() // 清空后保存
  }

  function sortStocks(by: keyof StockInfo, ascending: boolean = true) {
    stocks.value.sort((a, b) => {
      const valueA = a[by]
      const valueB = b[by]

      if (valueA === undefined || valueB === undefined) return 0

      const compareResult =
        typeof valueA === 'string'
          ? valueA.localeCompare(valueB as string)
          : Number(valueA) - Number(valueB)

      return ascending ? compareResult : -compareResult
    })

    saveToLocalStorage() // 排序后保存
  }

  return {
    // 状态
    currentStock,
    currentStockCode,
    stocks,
    loading,
    error,

    // 计算属性
    stockCount,
    topGainer,
    topLoser,
    getStockByCode,

    // 方法
    setCurrentStock,
    setCurrentStockCode,
    addStock,
    removeStock,
    addStocks,
    fetchWatchlist,
    updateStockInfo,
    clearWatchlist,
    sortStocks,
    // 导出本地存储相关方法，以便在需要时手动调用
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
