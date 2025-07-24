/**
 * @typedef {Object} StockDataOptions
 * @property {number} [basePrice=500] - 初始基础价格
 * @property {number} [volumeMin=100000] - 最小成交量
 * @property {number} [volumeMax=1000000] - 最大成交量
 * @property {string} [date='2025-06-23'] - 日期
 * @property {number} [volatility=0.3] - 基础波动率 (0-1)
 * @property {number} [priceMin] - 最低价格限制 (默认 basePrice * 0.8)
 * @property {number} [priceMax] - 最高价格限制 (默认 basePrice * 1.2)
 */

/**
 * @typedef {Object} StockData
 * @property {string} date - 日期
 * @property {number} open - 开盘价
 * @property {number} high - 最高价
 * @property {number} low - 最低价
 * @property {number} close - 收盘价
 * @property {number} volume - 成交量
 * @property {number} change - 价格变化
 * @property {number} changePercent - 价格变化百分比
 * @property {string} marketState - 市场状态
 * @property {number} bid - 买价
 * @property {number} ask - 卖价
 * @property {number} bidSize - 买盘量
 * @property {number} askSize - 卖盘量
 * @property {number} spread - 买卖价差
 * @property {string} [event] - 市场事件
 */

// 市场状态定义
export const marketStates = {
  NORMAL: { min: -0.02, max: 0.02, volMultiplier: 1, duration: [3, 10] },
  VOLATILE: { min: -0.05, max: 0.05, volMultiplier: 1.5, duration: [2, 5] },
  CRASH: { min: -0.1, max: -0.02, volMultiplier: 2, duration: [1, 3] },
  RALLY: { min: 0.02, max: 0.1, volMultiplier: 1.8, duration: [1, 4] },
};

// 市场事件定义
export const marketEvents = [
  { name: '无事件', probability: 0.7, impact: 0 },
  { name: '财报发布', probability: 0.1, impact: 0.05 },
  { name: '政策变化', probability: 0.08, impact: 0.08 },
  { name: '行业新闻', probability: 0.07, impact: 0.03 },
  { name: '重大公告', probability: 0.05, impact: 0.12 },
];
