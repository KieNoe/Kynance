import { calculateIndicators } from './calculate';
import {
  calculatePositionPeriod,
  calculatePositionUtilizationRate,
  calculateVolatility,
  getSignal,
  shouldStopLoss,
  shouldTrailingStop,
} from './judge';
/**
 * 根据历史数据生成交易策略的回测结果
 *
 * @param {Object} backtestConfig - 回测配置参数
 *   @property {string} strategy - 策略名称（如：'ma_cross'均线交叉, 'rsi_reversal'RSI反转, 'bollinger_bands'布林带）
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
 */
export const generateBacktestResult = (backtestConfig, strategyParams, stocksData) => {
  // 初始化回测结果数据
  const trades = [];
  const equityCurve = [];
  let currentValue = backtestConfig.initialCapital;
  let cash = backtestConfig.initialCapital;
  let shares = 0;
  let buyPrice = 0;
  let maxValue = currentValue;
  let maxDrawdown = 0;
  let winCount = 0;
  let lossCount = 0;
  let totalWinAmount = 0;
  let totalLossAmount = 0;

  // 根据不同策略计算指标
  const indicators = calculateIndicators(stocksData, strategyParams, backtestConfig.strategy);

  // 初始化第一天的权益曲线
  if (stocksData.length > 0) {
    equityCurve.push({
      date: stocksData[0].date,
      value: currentValue,
    });
  }

  // 遍历每一天的数据进行回测
  for (let i = 1; i < stocksData.length; i++) {
    const today = stocksData[i];
    const yesterday = stocksData[i - 1];
    const signal = getSignal(today, yesterday, indicators, i, backtestConfig.strategy, strategyParams);

    // 处理买入信号
    if (signal === 'BUY' && shares === 0 && cash > 0) {
      // 计算可买入的股数（考虑手续费）
      const availableCash = cash * (1 - backtestConfig.commission);
      const buyQuantity = Math.floor(availableCash / today.close);

      if (buyQuantity > 0) {
        const cost = buyQuantity * today.close;
        const commission = cost * backtestConfig.commission;
        cash -= cost + commission;
        shares += buyQuantity;
        buyPrice = today.close;

        trades.push({
          id: trades.length + 1,
          date: today.date,
          type: '买入',
          price: today.close.toFixed(2),
          quantity: buyQuantity,
          amount: cost.toFixed(2),
          profit: '0.00',
          totalValue: (cash + shares * today.close).toFixed(2),
        });
      }
    }
    // 处理卖出信号
    else if (
      (signal === 'SELL' ||
        shouldStopLoss(today.close, buyPrice, strategyParams) ||
        shouldTrailingStop(today.close, maxValue, strategyParams)) &&
      shares > 0
    ) {
      const sellValue = shares * today.close;
      const commission = sellValue * backtestConfig.commission;
      const profit = sellValue - shares * buyPrice - commission;
      cash += sellValue - commission;

      // 记录盈亏情况
      if (profit > 0) {
        winCount++;
        totalWinAmount += profit;
      } else {
        lossCount++;
        totalLossAmount += Math.abs(profit);
      }

      trades.push({
        id: trades.length + 1,
        date: today.date,
        type: '卖出',
        price: today.close.toFixed(2),
        quantity: shares,
        amount: sellValue.toFixed(2),
        profit: profit.toFixed(2),
        totalValue: cash.toFixed(2),
      });

      shares = 0;
    }

    // 更新当前总资产价值
    currentValue = cash + shares * today.close;

    // 更新最大资产价值和最大回撤
    if (currentValue > maxValue) {
      maxValue = currentValue;
    } else {
      const drawdown = (maxValue - currentValue) / maxValue;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // 更新权益曲线
    equityCurve.push({
      date: today.date,
      value: currentValue,
    });
  }

  // 计算回测结果指标
  const totalReturn = (currentValue - backtestConfig.initialCapital) / backtestConfig.initialCapital;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? winCount / totalTrades : 0;
  const avgWin = winCount > 0 ? (totalWinAmount / winCount / backtestConfig.initialCapital) * 100 : 0;
  const avgLoss = lossCount > 0 ? (totalLossAmount / lossCount / backtestConfig.initialCapital) * 100 : 0;

  // 计算年化收益率
  const firstDate = new Date(stocksData[0].date);
  const lastDate = new Date(stocksData[stocksData.length - 1].date);
  const yearFraction = (lastDate.getTime() - firstDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
  const annualReturn = Math.pow(1 + totalReturn, 1 / yearFraction) - 1;

  // 计算波动率
  const dailyReturns = [];
  for (let i = 1; i < equityCurve.length; i++) {
    const dailyReturn = (equityCurve[i].value - equityCurve[i - 1].value) / equityCurve[i - 1].value;
    dailyReturns.push(dailyReturn);
  }
  const volatility = calculateVolatility(dailyReturns) * 100;

  // 计算夏普比率 (假设无风险利率为3%)
  const riskFreeRate = 0.03;
  const sharpeRatio = (annualReturn - riskFreeRate) / (volatility / 100);

  // 计算平均持仓周期
  const positionPeriod = calculatePositionPeriod(trades);

  // 计算其他指标
  const beta = 0.85; // 假设值，实际应该根据市场基准计算
  const positionUtilizationRate = calculatePositionUtilizationRate(equityCurve, backtestConfig.initialCapital);
  const correlationAnalysis = 0.75; // 假设值，实际应该计算与市场指数的相关性
  const sectorDistribution = 1; // 假设值，实际应该根据股票所属板块计算

  return {
    totalReturn,
    annualReturn,
    maxDrawdown,
    sharpeRatio,
    totalTrades,
    winRate,
    avgWin,
    avgLoss,
    trades,
    equityCurve,
    positionPeriod,
    volatility,
    Beta: beta,
    positionUtilizationRate,
    correlationAnalysis,
    sectorDistribution,
  };
};
