import { calculateIndicators } from './calculate';
import {
  calculatePositionPeriod,
  calculatePositionUtilizationRate,
  calculateVolatility,
  getSignal,
  shouldStopLoss,
  shouldTrailingStop,
} from './judge';
export * from './compiler';
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
