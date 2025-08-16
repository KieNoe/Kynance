import { generateBacktestResult } from '@kynance/strategy-engine'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { watch } from 'vue'

const STORAGE_KEY = 'kynance-backtest'

export const useBacktestStore = defineStore('backtest', () => {
  let strategy = [
    {
      name: '示例1',
      time: '2025-08-07',
      id: 'example1',
      backtestConfig: {
        strategy: 'ma_cross',
        symbol: '000001',
        dateRange: ['2024-01-01', '2025-01-01'], //回测周期
        initialCapital: 100000, //初始资金
        commission: 0.0003, //手续费率
      },
      strategyParams: {
        holdingPeriod: 15,
        shareHoldingLimit: 15,
        profitHoldThreshold: 5,
        trailingStopPercent: 3,
        stopLossLimit: 5,
        // 均线交叉策略参数:ma_cross
        shortPeriod: 5,
        longPeriod: 20,
        // RSI策略参数:rsi_reversal
        rsiPeriod: 14,
        overbought: 80,
        oversold: 20,
        //布林带策略参数:bollinger_bands
        bollingerBandsPeriod: 20,
        standardDeviationMultiple: 2,
      },
    },
    {
      name: '示例2',
      time: '2025-08-07',
      id: 'example2',
      backtestConfig: {
        strategy: 'rsi_reversal',
        symbol: '000001',
        dateRange: ['2024-01-01', '2025-01-01'], //回测周期
        initialCapital: 100000, //初始资金
        commission: 0.0003, //手续费率
      },
      strategyParams: {
        holdingPeriod: 15,
        shareHoldingLimit: 15,
        profitHoldThreshold: 5,
        trailingStopPercent: 3,
        stopLossLimit: 5,
        // 均线交叉策略参数:ma_cross
        shortPeriod: 5,
        longPeriod: 20,
        // RSI策略参数:rsi_reversal
        rsiPeriod: 14,
        overbought: 70,
        oversold: 30,
        //布林带策略参数:bollinger_bands
        bollingerBandsPeriod: 20,
        standardDeviationMultiple: 2,
      },
    },
    {
      name: '示例3',
      time: '2025-08-07',
      id: 'example3',
      backtestConfig: {
        strategy: 'bollinger_bands',
        symbol: '000001',
        dateRange: ['2024-01-01', '2025-01-01'], //回测周期
        initialCapital: 100000, //初始资金
        commission: 0.0003, //手续费率
      },
      strategyParams: {
        holdingPeriod: 15,
        shareHoldingLimit: 15,
        profitHoldThreshold: 5,
        trailingStopPercent: 3,
        stopLossLimit: 5,
        // 均线交叉策略参数:ma_cross
        shortPeriod: 5,
        longPeriod: 20,
        // RSI策略参数:rsi_reversal
        rsiPeriod: 14,
        overbought: 80,
        oversold: 20,
        //布林带策略参数:bollinger_bands
        bollingerBandsPeriod: 20,
        standardDeviationMultiple: 2,
      },
    },
  ]
  const getBacktestResult = {
    isCustomCode: false,
    func: generateBacktestResult,
    defaultFunc: generateBacktestResult,
  }
  function addStrategy(newStrategy) {
    const existingIndex = strategy.findIndex((s) => s.name === newStrategy.name)

    if (existingIndex !== -1) {
      // 如果存在同名策略，则覆盖它
      strategy[existingIndex] = newStrategy
    } else {
      // 如果不存在同名策略，则添加新策略
      strategy.push(newStrategy)
    }
    if (!newStrategy.id) {
      newStrategy.id = `strategy_${dayjs().valueOf()}` // 使用dayjs获取时间戳
    }
    if (!newStrategy.time) {
      newStrategy.time = dayjs().format('YYYY-MM-DD') // 使用dayjs格式化当前日期
    }
    strategy.push(newStrategy)
    saveToLocalStorage()
  }
  function getStrategy() {
    return strategy
  }
  function deleteStrategy(id) {
    if (id) {
      strategy = strategy.filter((s) => s.id !== id)
    }
  }
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strategy))
    } catch (err) {
      console.error('保存自选股到本地存储失败:', err)
    }
  }
  function loadFromLocalStorage() {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY)
      if (storedData) {
        return JSON.parse(storedData)
      }
    } catch (err) {
      console.error('从本地存储加载自选股失败:', err)
    }
    return [
      {
        name: '示例1',
        time: '2025-08-07',
        id: 'example1',
        backtestConfig: {
          strategy: 'ma_cross',
          symbol: '000001',
          dateRange: ['2024-01-01', '2025-01-01'], //回测周期
          initialCapital: 100000, //初始资金
          commission: 0.0003, //手续费率
        },
        strategyParams: {
          holdingPeriod: 15,
          shareHoldingLimit: 15,
          profitHoldThreshold: 5,
          trailingStopPercent: 3,
          stopLossLimit: 5,
          // 均线交叉策略参数:ma_cross
          shortPeriod: 5,
          longPeriod: 20,
          // RSI策略参数:rsi_reversal
          rsiPeriod: 14,
          overbought: 80,
          oversold: 20,
          //布林带策略参数:bollinger_bands
          bollingerBandsPeriod: 20,
          standardDeviationMultiple: 2,
        },
      },
      {
        name: '示例2',
        time: '2025-08-07',
        id: 'example2',
        backtestConfig: {
          strategy: 'rsi_reversal',
          symbol: '000001',
          dateRange: ['2024-01-01', '2025-01-01'], //回测周期
          initialCapital: 100000, //初始资金
          commission: 0.0003, //手续费率
        },
        strategyParams: {
          holdingPeriod: 15,
          shareHoldingLimit: 15,
          profitHoldThreshold: 5,
          trailingStopPercent: 3,
          stopLossLimit: 5,
          // 均线交叉策略参数:ma_cross
          shortPeriod: 5,
          longPeriod: 20,
          // RSI策略参数:rsi_reversal
          rsiPeriod: 14,
          overbought: 80,
          oversold: 20,
          //布林带策略参数:bollinger_bands
          bollingerBandsPeriod: 20,
          standardDeviationMultiple: 2,
        },
      },
      {
        name: '示例3',
        time: '2025-08-07',
        id: 'example3',
        backtestConfig: {
          strategy: 'bollinger_bands',
          symbol: '000001',
          dateRange: ['2024-01-01', '2025-01-01'], //回测周期
          initialCapital: 100000, //初始资金
          commission: 0.0003, //手续费率
        },
        strategyParams: {
          holdingPeriod: 15,
          shareHoldingLimit: 15,
          profitHoldThreshold: 5,
          trailingStopPercent: 3,
          stopLossLimit: 5,
          // 均线交叉策略参数:ma_cross
          shortPeriod: 5,
          longPeriod: 20,
          // RSI策略参数:rsi_reversal
          rsiPeriod: 14,
          overbought: 80,
          oversold: 20,
          //布林带策略参数:bollinger_bands
          bollingerBandsPeriod: 20,
          standardDeviationMultiple: 2,
        },
      },
    ]
  }
  strategy = loadFromLocalStorage()
  watch(
    strategy,
    () => {
      saveToLocalStorage()
    },
    { deep: true },
  )
  return {
    strategy,
    getBacktestResult,
    getStrategy,
    addStrategy,
    deleteStrategy,
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
