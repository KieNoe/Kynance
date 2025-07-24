import dayjs from 'dayjs';

import { marketStates } from './types.ts';
import { updateMarketState, getRandomEvent, getMarketStateTracker, resetMarketStateTracker } from './marketState.ts';
import { generateFixedDates } from './utils.ts';

/**
 * 生成多日股票数据
 * @param {StockDataOptions} [options] - 配置选项
 * @param {[string, string]} [dateRange=['2025-06-23', '2025-06-25']] - 日期范围
 * @returns {StockData[]} 股票数据数组
 */
export function getWholeData(
  options = { basePrice: 500, volumeMin: 100000, volumeMax: 1000000 },
  dateRange = ['2025-06-23', '2025-06-25'],
) {
  // 重置市场状态跟踪器
  resetMarketStateTracker(options);

  const dateList = generateFixedDates(dateRange);
  const result = [];

  for (const date of dateList) {
    updateMarketState();

    const hour = dayjs(date).hour();
    const minute = dayjs(date).minute();

    if (hour === 12 && minute > 0) {
      result.push({
        date: date,
        open: null,
        high: null,
        low: null,
        close: null,
        volume: null,
      });
      continue;
    }

    const stockData = generateRealisticStockData({ ...options, date });
    const tracker = getMarketStateTracker();
    tracker.previousClose = stockData.close;

    // 更平滑的趋势更新 (降低变化幅度)
    if (stockData.changePercent > 1.0) {
      // 提高触发阈值
      tracker.trend = Math.min(tracker.trend + 0.1, 1); // 降低增量
    } else if (stockData.changePercent < -1.0) {
      tracker.trend = Math.max(tracker.trend - 0.1, -1);
    } else {
      // 更平滑的趋势衰减
      tracker.trend *= 0.9; // 增加衰减系数
      if (Math.abs(tracker.trend) < 0.05) tracker.trend = 0;
    }

    result.push(stockData);
  }

  return result;
}

/**
 * 生成更真实的模拟股票数据
 * @param {StockDataOptions} [options] - 配置选项
 * @returns {StockData} 股票数据对象
 */
function generateRealisticStockData(options) {
  const config = {
    basePrice: 500,
    volumeMin: 100000,
    volumeMax: 1000000,
    date: '2025-06-23',
    volatility: 0.3,
    priceMin: undefined,
    priceMax: undefined,
    ...options,
  };

  // 设置默认价格范围
  if (config.priceMin === undefined) {
    config.priceMin = config.basePrice * 0.85;
  }
  if (config.priceMax === undefined) {
    config.priceMax = config.basePrice * 1.15;
  }

  const tracker = getMarketStateTracker();
  const stateParams = marketStates[tracker.currentState];
  const previousClose = tracker.previousClose;

  // 1. 确定基础价格 (增加均值回归特性)
  let basePrice = previousClose * (1 + tracker.trend * 0.005); // 降低趋势影响

  // 2. 应用市场状态波动 (限制最大波动)
  const stateEffect = Math.min(
    Math.max(stateParams.min + Math.random() * (stateParams.max - stateParams.min), -0.05),
    0.05,
  );
  basePrice *= 1 + stateEffect;

  // 3. 应用随机事件影响 (限制最大影响)
  const event = getRandomEvent();
  if (event.impact !== 0) {
    const impactFactor = Math.min(event.impact, 0.1); // 限制最大影响
    basePrice *= 1 + (Math.random() > 0.5 ? 1 : -1) * impactFactor * (0.5 + Math.random() * 0.5);
  }

  // 确保价格在允许范围内
  basePrice = Math.max(config.priceMin, Math.min(config.priceMax, basePrice));

  // 4. 生成日内价格模式
  const { open, high, low, close, volume } = generateIntradayPrices(basePrice, config, stateParams);

  // 基础数据
  const baseData = {
    date: config.date,
    open,
    high,
    low,
    close,
    volume: Math.round(volume),
    change: parseFloat((close - open).toFixed(2)),
    changePercent: parseFloat((((close - open) / open) * 100).toFixed(2)),
    marketState: tracker.currentState,
    ...(event.name !== '无事件' && { event: event.name }),
  };

  // 添加市场微观结构
  return addMarketMicrostructure(baseData);
}

/**
 * 生成日内价格和成交量
 * @param {number} basePrice - 基础价格
 * @param {StockDataOptions} config - 配置
 * @param {Object} stateParams - 市场状态参数
 * @returns {Object} 价格和成交量数据
 */
function generateIntradayPrices(basePrice, config, stateParams) {
  // 开盘波动 (通常比盘中波动大)
  const openFluctuation = basePrice * (0.002 + Math.random() * 0.005) * stateParams.volMultiplier;
  let open = basePrice * (1 + ((Math.random() > 0.5 ? 1 : -1) * openFluctuation) / basePrice);

  // 确保开盘价在允许范围内
  open = Math.max(config.priceMin, Math.min(config.priceMax, open));

  // 日内趋势 (可能延续开盘方向或反转)
  // 增加均值回归概率
  let intradayTrend = 0;
  if (Math.random() > 0.6) {
    // 40% 概率反转
    intradayTrend = open > basePrice ? -1 : 1;
  } else if (Math.random() > 0.3) {
    // 30% 概率延续
    intradayTrend = open > basePrice ? 1 : -1;
  } // 30% 概率无趋势

  // 限制最大波动范围
  const maxFluctuation = basePrice * (0.003 + Math.random() * 0.01) * stateParams.volMultiplier;

  // 生成高点和低点
  let high = open + Math.abs(intradayTrend) * maxFluctuation * (0.7 + Math.random() * 0.3);
  let low = open - Math.abs(intradayTrend) * maxFluctuation * (0.7 + Math.random() * 0.3);

  // 确保高>低且在允许范围内
  high = Math.max(config.priceMin, Math.min(config.priceMax, high));
  low = Math.max(config.priceMin, Math.min(config.priceMax, low));
  if (high < low) [high, low] = [low, high];

  // 收盘价 (通常接近当日趋势方向)
  let close;
  if (intradayTrend > 0) {
    close = open + (high - open) * (0.5 + Math.random() * 0.3);
  } else {
    close = open - (open - low) * (0.5 + Math.random() * 0.3);
  }

  // 确保收盘价在允许范围内
  close = Math.max(config.priceMin, Math.min(config.priceMax, close));

  // 成交量模式 (开盘和收盘通常成交量较大)
  const volatility = (high - low) / basePrice;
  const volume = calculateVolume(config, stateParams, volatility);

  return {
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
    volume,
  };
}

/**
 * 计算成交量
 * @param {StockDataOptions} config - 配置
 * @param {Object} stateParams - 市场状态参数
 * @param {number} volatility - 当日波动率
 * @returns {number} 成交量
 */
function calculateVolume(config, stateParams, volatility) {
  // 基础成交量范围
  const baseRange = config.volumeMax - config.volumeMin;

  // 波动率影响 (波动越大成交量越大，但限制影响范围)
  const volEffect = 1 + Math.min(volatility * 3, 1.5); // 限制最大放大1.5倍

  // 市场状态乘数 (不同状态有不同的基础成交量水平)
  const stateBaseVolume = 0.5 + (stateParams.volMultiplier - 1) * 0.3;

  // 时间因子 (开盘和收盘成交量较大，使用更合理的随机分布)
  const effectiveTimeFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2之间的随机值

  // 计算最终成交量
  const volume =
    config.volumeMin +
    baseRange *
      (stateBaseVolume + (Math.random() * 0.3 - 0.15)) * // 市场状态基础水平 ±15%
      volEffect *
      effectiveTimeFactor;

  // 确保成交量在合理范围内
  return Math.min(Math.max(Math.round(volume), config.volumeMin), config.volumeMax);
}

/**
 * 添加市场微观结构
 * @param {StockData} data - 基础股票数据
 * @returns {StockData} 增强后的股票数据
 */
function addMarketMicrostructure(data) {
  // 买卖价差与波动率相关
  const volatility = (data.high - data.low) / data.close;
  const spread = data.close * (0.0005 + volatility * 0.003);

  // 买卖盘大小与成交量相关
  const volumeRatio = (data.volume - 100000) / 900000; // 标准化到0-1
  const baseSize = 100 + volumeRatio * 9900;

  return {
    ...data,
    bid: parseFloat((data.close - spread / 2).toFixed(2)),
    ask: parseFloat((data.close + spread / 2).toFixed(2)),
    bidSize: Math.floor(baseSize * (0.8 + Math.random() * 0.4)),
    askSize: Math.floor(baseSize * (0.8 + Math.random() * 0.4)),
    spread: parseFloat(spread.toFixed(4)),
  };
}
