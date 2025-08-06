// 获取交易信号
export function getSignal(today, yesterday, indicators, index, strategy, params) {
  switch (strategy) {
    case 'ma_cross':
      // 短期均线上穿长期均线买入
      if (
        index > params.longPeriod &&
        indicators.shortMA[index - 1] <= indicators.longMA[index - 1] &&
        indicators.shortMA[index] > indicators.longMA[index]
      ) {
        return 'BUY';
      }
      // 短期均线下穿长期均线卖出
      else if (
        index > params.longPeriod &&
        indicators.shortMA[index - 1] >= indicators.longMA[index - 1] &&
        indicators.shortMA[index] < indicators.longMA[index]
      ) {
        return 'SELL';
      }
      break;

    case 'rsi_reversal':
      // RSI超卖后回升买入
      if (indicators.rsi[index - 1] <= params.oversold && indicators.rsi[index] > params.oversold) {
        return 'BUY';
      }
      // RSI超买后回落卖出
      else if (indicators.rsi[index - 1] >= params.overbought && indicators.rsi[index] < params.overbought) {
        return 'SELL';
      }
      break;

    case 'bollinger_bands':
      // 价格触及下轨后反弹买入
      if (yesterday.close <= indicators.lower[index - 1] && today.close > yesterday.close) {
        return 'BUY';
      }
      // 价格触及上轨后回落卖出
      else if (yesterday.close >= indicators.upper[index - 1] && today.close < yesterday.close) {
        return 'SELL';
      }
      break;
  }

  return 'HOLD';
}

// 判断是否应该止损
export function shouldStopLoss(currentPrice, buyPrice, params) {
  if (buyPrice === 0) return false;
  const loss = (buyPrice - currentPrice) / buyPrice;
  return loss >= params.stopLossLimit / 100;
}

// 判断是否应该跟踪止盈
export function shouldTrailingStop(currentPrice, maxValue, params) {
  const decline = (maxValue - currentPrice) / maxValue;
  return decline >= params.trailingStopPercent / 100;
}

// 计算波动率
export function calculateVolatility(returns) {
  if (returns.length === 0) return 0;

  // 计算平均收益率
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // 计算方差
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;

  // 计算标准差（波动率）
  return Math.sqrt(variance * 252); // 年化波动率
}

// 计算平均持仓周期
export function calculatePositionPeriod(trades) {
  let totalDays = 0;
  let positions = 0;

  for (let i = 0; i < trades.length; i += 2) {
    if (i + 1 < trades.length) {
      const buyDate = new Date(trades[i].date);
      const sellDate = new Date(trades[i + 1].date);
      const days = Math.round((sellDate.getTime() - buyDate.getTime()) / (24 * 60 * 60 * 1000));
      totalDays += days;
      positions++;
    }
  }

  return positions > 0 ? Math.round(totalDays / positions) : 0;
}

// 计算仓位利用率
export function calculatePositionUtilizationRate(equityCurve, initialCapital) {
  let totalPositionValue = 0;

  for (const point of equityCurve) {
    totalPositionValue += point.value - initialCapital;
  }

  return (totalPositionValue / (initialCapital * equityCurve.length)) * 100;
}
