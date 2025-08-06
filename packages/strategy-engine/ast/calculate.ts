/* eslint-disable no-case-declarations */
// 计算技术指标
export function calculateIndicators(data, params, strategy) {
  const indicators: any = {};

  // 根据不同策略计算不同指标
  switch (strategy) {
    case 'ma_cross':
      indicators.shortMA = calculateMA(data, params.shortPeriod);
      indicators.longMA = calculateMA(data, params.longPeriod);
      break;
    case 'rsi_reversal':
      indicators.rsi = calculateRSI(data, params.rsiPeriod);
      break;
    case 'bollinger_bands':
      const bb = calculateBollingerBands(data, params.bollingerBandsPeriod, params.standardDeviationMultiple);
      indicators.upper = bb.upper;
      indicators.middle = bb.middle;
      indicators.lower = bb.lower;
      break;
  }

  return indicators;
}

// 计算移动平均线
function calculateMA(data, period) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      result.push(sum / period);
    }
  }

  return result;
}

// 计算RSI指标
function calculateRSI(data, period) {
  const result = [];
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = data[i].close - data[i - 1].close;

    if (i < period) {
      gains += change > 0 ? change : 0;
      losses += change < 0 ? -change : 0;
      result.push(null);
    } else {
      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        result.push(rsi);
      } else {
        const change = data[i].close - data[i - 1].close;
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        const avgGain = (result[i - 1] * (period - 1) + gain) / period;
        const avgLoss = (result[i - 1] * (period - 1) + loss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        result.push(rsi);
      }
    }
  }

  return result;
}

// 计算布林带
function calculateBollingerBands(data, period, stdDev) {
  const middle = calculateMA(data, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      lower.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += Math.pow(data[i - j].close - middle[i], 2);
      }
      const std = Math.sqrt(sum / period);
      upper.push(middle[i] + stdDev * std);
      lower.push(middle[i] - stdDev * std);
    }
  }

  return { upper, middle, lower };
}
