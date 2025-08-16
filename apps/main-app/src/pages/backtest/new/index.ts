import { t } from '@/infrastructure/locales'
export const CUSTOM_STORAGE_KEY = 'kynance-customCode'

export const defaultCodeContent =
  localStorage.getItem(CUSTOM_STORAGE_KEY) ||
  `/**
 * 交易策略函数
 *
 * @param {Object} backtestConfig - 回测配置参数
 * @param {Object} strategyParams - 策略参数
 * @param {Array} stocksData - 股票历史数据数组
 * @returns {Object} 回测结果对象
 */
const runStrategy = (backtestConfig, strategyParams, stocksData) => {
  // 初始化结果对象
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 在这里实现您的交易策略逻辑

  return result;
}
/**
 * 根据历史数据生成交易策略的回测结果
 *
 * @param {Object} backtestConfig - 回测配置参数
 *   @property {string} strategy - 策略名称（必填），目前支持'ma_cross'均线交叉, 'rsi_reversal'RSI反转, 'bollinger_bands'布林带）
 *   @property {string} symbol - 测试的股票代码
 *   @property {string[]} dateRange - 回测日期范围 [开始日期, 结束日期]
 *   @property {number} initialCapital - 初始资金（单位：元）
 *   @property {number} commission - 交易手续费率（如0.0003表示0.03%）
 *
 * @param {Object} strategyParams - 策略参数
 *   @property {number} holdingPeriod - 最大持仓周期（天）
 *   @property {number} shareHoldingLimit - 最大持股数量
 *   @property {number} profitHoldThreshold - 盈利持仓阈值（百分比）
 *   @property {number} trailingStopPercent - 移动止损百分比
 *   @property {number} stopLossLimit - 止损百分比
 *   // 均线交叉策略专有参数
 *   @property {number} shortPeriod - 短期均线周期
 *   @property {number} longPeriod - 长期均线周期
 *   // RSI策略专有参数
 *   @property {number} rsiPeriod - RSI计算周期
 *   @property {number} overbought - 超买阈值
 *   @property {number} oversold - 超卖阈值
 *   // 布林带策略专有参数
 *   @property {number} bollingerBandsPeriod - 布林带计算周期
 *   @property {number} standardDeviationMultiple - 标准差倍数
 *
 * @param {Array} stocksData - 股票历史数据数组
 *   @property {string} date - 日期（YYYY-MM-DD格式）
 *   @property {number} open - 开盘价
 *   @property {number} high - 当日最高价
 *   @property {number} low - 当日最低价
 *   @property {number} close - 收盘价
 *   @property {number} volume - 成交量
 *   @property {number} change - 价格变动
 *   @property {number} changePercent - 价格变动百分比
 *   @property {string} marketState - 市场状态（如"NORMAL"正常交易）
 *   @property {number} bid - 买一价
 *   @property {number} ask - 卖一价
 *   @property {number} bidSize - 买一量
 *   @property {number} askSize - 卖一量
 *   @property {number} spread - 买卖价差
 *
 * @returns {Object} 回测结果对象
 *   @property {number} totalReturn - 总收益率（百分比）
 *   @property {number} annualReturn - 年化收益率（百分比）
 *   @property {number} maxDrawdown - 最大回撤（百分比）
 *   @property {number} sharpeRatio - 夏普比率（风险调整后收益）
 *   @property {number} totalTrades - 总交易次数
 *   @property {number} winRate - 胜率（百分比）
 *   @property {number} avgWin - 平均盈利（百分比）
 *   @property {number} avgLoss - 平均亏损（百分比）
 *   @property {Array} trades - 所有交易记录
 *     @property {number} id - 交易ID
 *     @property {string} date - 交易日期
 *     @property {string} type - 交易类型（"买入"/"卖出"）
 *     @property {string} price - 成交价格
 *     @property {number} quantity - 交易数量（股）
 *     @property {string} amount - 交易金额
 *     @property {string} profit - 盈亏金额
 *     @property {string} totalValue - 交易后总资产
 *   @property {Array} equityCurve - 每日资产曲线
 *     @property {string} date - 日期
 *     @property {number} value - 当日资产总值
 *   @property {number} positionPeriod - 平均持仓周期（天）
 *   @property {number} volatility - 年化波动率（百分比）
 *   @property {number} Beta - 贝塔系数（市场相关性）
 *   @property {number} positionUtilizationRate - 仓位利用率（百分比）
 *   @property {number} correlationAnalysis - 与大盘相关性（0-1）
 *   @property {number} sectorDistribution - 行业分布（1表示单只股票）
 */`

export const snippetOptions = [
  { content: t('pages.backtest.new.ma'), value: 'ma_cross' },
  { content: t('pages.backtest.new.rsi'), value: 'rsi_reversal' },
  { content: t('pages.backtest.new.bollinger'), value: 'bollinger_bands' },
]

export const columns = [
  { colKey: 'name', title: t('pages.backtest.new.columns.name'), width: 200 },
  { colKey: 'createTime', title: t('pages.backtest.new.columns.createTime'), width: 180 },
  { colKey: 'updateTime', title: t('pages.backtest.new.columns.updateTime'), width: 180 },
  { colKey: 'op', title: t('pages.backtest.new.columns.op'), width: 100 },
]

export const defaultEditorOptions = {
  automaticLayout: true,
  foldingStrategy: 'indentation',
  renderLineHighlight: 'all',
  selectOnLineNumbers: true,
  minimap: {
    enabled: true,
  },
  readOnly: false,
  contextmenu: true,
  fontSize: 14,
  scrollBeyondLastLine: false,
  overviewRulerBorder: false,
}

export const maTemplateCode = `/**
 * 均线交叉策略
 * 当短期均线上穿长期均线时买入，下穿时卖出
 */
function runStrategy(backtestConfig, strategyParams, stocksData) {
  const { shortPeriod, longPeriod } = strategyParams;
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 计算短期和长期移动平均线
  const shortMA = calculateMA(stocksData, shortPeriod);
  const longMA = calculateMA(stocksData, longPeriod);

  // 实现交易逻辑
  // ...

  return result;
}

// 计算移动平均线
function calculateMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push(sum / period);
  }
  return result;
}`

export const rsiTemplateCode = `/**
 * RSI反转策略
 * 当RSI低于超卖阈值时买入，高于超买阈值时卖出
 */
function runStrategy(backtestConfig, strategyParams, stocksData) {
  const { rsiPeriod, overbought, oversold } = strategyParams;
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 计算RSI指标
  const rsiValues = calculateRSI(stocksData, rsiPeriod);

  // 实现交易逻辑
  // ...

  return result;
}

// 计算RSI指标
function calculateRSI(data, period) {
  const rsi = [];
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }

    const change = data[i].close - data[i-1].close;

    if (i <= period) {
      gains += change > 0 ? change : 0;
      losses += change < 0 ? -change : 0;

      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      } else {
        rsi.push(null);
      }
    } else {
      const avgGain = ((gains * (period - 1)) + (change > 0 ? change : 0)) / period;
      const avgLoss = ((losses * (period - 1)) + (change < 0 ? -change : 0)) / period;

      gains = avgGain;
      losses = avgLoss;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }

  return rsi;
}`

export const bollingerTemplateCode = `/**
 * 布林带策略
 * 当价格触及下轨时买入，触及上轨时卖出
 */
function runStrategy(backtestConfig, strategyParams, stocksData) {
  const { bollingerBandsPeriod, standardDeviationMultiple } = strategyParams;
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 计算布林带
  const { middle, upper, lower } = calculateBollingerBands(stocksData, bollingerBandsPeriod, standardDeviationMultiple);

  // 实现交易逻辑
  // ...

  return result;
}

// 计算布林带
function calculateBollingerBands(data, period, stdDev) {
  const middle = [];
  const upper = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      middle.push(null);
      upper.push(null);
      lower.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const ma = sum / period;

    let squaredDiffSum = 0;
    for (let j = 0; j < period; j++) {
      squaredDiffSum += Math.pow(data[i - j].close - ma, 2);
    }
    const stdDevValue = Math.sqrt(squaredDiffSum / period);

    middle.push(ma);
    upper.push(ma + (stdDevValue * stdDev));
    lower.push(ma - (stdDevValue * stdDev));
  }

  return { middle, upper, lower };
}`
