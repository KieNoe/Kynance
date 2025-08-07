/* eslint-disable no-case-declarations */
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
      // 参数中增加buffer（例如20）
      const buffer = params.buffer || 19;

      // RSI从超卖区回升（不一定要完全穿越，接近即可）
      if (indicators.rsi[index - 1] <= params.oversold + buffer && indicators.rsi[index] > params.oversold + buffer) {
        return 'BUY';
      }
      // RSI从超买区回落（不一定要完全穿越，接近即可）
      else if (
        indicators.rsi[index - 1] >= params.overbought - buffer &&
        indicators.rsi[index] < params.overbought - buffer
      ) {
        return 'SELL';
      }
      break;

    case 'bollinger_bands':
      // 设置缓冲区比例（例如0.05表示5%的带宽作为缓冲）
      const bandwidthBuffer = params.buffer || 0.1;

      // 计算动态缓冲范围
      const bandWidth = indicators.upper[index - 1] - indicators.lower[index - 1];
      const upperBuffer = indicators.upper[index - 1] - bandWidth * bandwidthBuffer;
      const lowerBuffer = indicators.lower[index - 1] + bandWidth * bandwidthBuffer;

      // 价格接近下轨（不要求完全触及）且开始反弹
      if (
        yesterday.close <= lowerBuffer &&
        today.close > yesterday.close && // 价格回升
        today.close > indicators.lower[index]
      ) {
        // 确认离开下轨区域
        return 'BUY';
      }
      // 价格接近上轨（不要求完全触及）且开始回落
      else if (
        yesterday.close >= upperBuffer &&
        today.close < yesterday.close && // 价格回落
        today.close < indicators.upper[index]
      ) {
        // 确认离开上轨区域
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
