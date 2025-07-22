export function calculateMA(data, period) {
  return data.map((_, index) => {
    if (index < period - 1) return null
    const slice = data.slice(index - period + 1, index + 1)
    const sum = slice.reduce((a, b) => a + b.close, 0)
    return sum / period
  })
}
export function calculateEMA(data, period) {
  const k = 2 / (period + 1)
  const ema = [data[0].close]

  for (let i = 1; i < data.length; i++) {
    ema.push(data[i].close * k + ema[i - 1] * (1 - k))
  }

  return ema
}

export function calculateMACD(data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
  const shortEMA = calculateEMA(data, shortPeriod)
  const longEMA = calculateEMA(data, longPeriod)

  const DIF = shortEMA.map((val, i) => val - longEMA[i])

  // 计算DEA (DIF的9日EMA)
  const DEA = [DIF[0]]
  const k = 2 / (signalPeriod + 1)

  for (let i = 1; i < DIF.length; i++) {
    DEA.push(DIF[i] * k + DEA[i - 1] * (1 - k))
  }

  const MACD = DIF.map((val, i) => (val - DEA[i]) * 2)

  return { DIF, DEA, MACD }
}
export function calculateBollingerBands(data, period = 20, multiplier = 2) {
  const middleBand = calculateMA(data, period)
  const stdDev = []

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1).map((d) => d.close)
    const avg = middleBand[i]
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / period
    stdDev.push(Math.sqrt(variance))
  }

  const upperBand = middleBand.map((val, i) =>
    i >= period - 1 ? val + stdDev[i - (period - 1)] * multiplier : null,
  )

  const lowerBand = middleBand.map((val, i) =>
    i >= period - 1 ? val - stdDev[i - (period - 1)] * multiplier : null,
  )

  return { middleBand, upperBand, lowerBand }
}
export function calculateRSI(data, period = 14) {
  const gains = []
  const losses = []

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

  const rsi = Array(period).fill(null)

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period

    const rs = avgGain / avgLoss
    rsi.push(100 - 100 / (1 + rs))
  }

  return rsi
}
export function calculateKDJ(data, period = 9) {
  const kdj = []

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const close = data[i].close
    const high = Math.max(...slice.map((d) => d.high))
    const low = Math.min(...slice.map((d) => d.low))

    const rsv = ((close - low) / (high - low)) * 100

    const prevK = kdj[i - 1] ? kdj[i - 1].K : 50
    const prevD = kdj[i - 1] ? kdj[i - 1].D : 50

    const K = (2 / 3) * prevK + (1 / 3) * rsv
    const D = (2 / 3) * prevD + (1 / 3) * K
    const J = 3 * K - 2 * D

    kdj.push({ K, D, J })
  }

  // 填充前period-1个null值
  return Array(period - 1)
    .fill(null)
    .concat(kdj)
}
export function calculateCCI(data, period = 20) {
  const cci = []

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const typicalPrices = slice.map((d) => (d.high + d.low + d.close) / 3)
    const sma = typicalPrices.reduce((a, b) => a + b, 0) / period

    const meanDeviation =
      typicalPrices.map((tp) => Math.abs(tp - sma)).reduce((a, b) => a + b, 0) / period

    const currentTypicalPrice = (data[i].high + data[i].low + data[i].close) / 3
    const cciValue = (currentTypicalPrice - sma) / (0.015 * meanDeviation)

    cci.push(cciValue)
  }

  return Array(period - 1)
    .fill(null)
    .concat(cci)
}
export function calculateOBV(data) {
  const obv = [0]

  for (let i = 1; i < data.length; i++) {
    if (data[i].close > data[i - 1].close) {
      obv.push(obv[i - 1] + data[i].volume)
    } else if (data[i].close < data[i - 1].close) {
      obv.push(obv[i - 1] - data[i].volume)
    } else {
      obv.push(obv[i - 1])
    }
  }

  return obv
}
export function calculateVWAP(data) {
  let cumulativeTypicalPriceVolume = 0
  let cumulativeVolume = 0
  const vwap = []

  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
    cumulativeTypicalPriceVolume += typicalPrice * data[i].volume
    cumulativeVolume += data[i].volume

    vwap.push(cumulativeTypicalPriceVolume / cumulativeVolume)
  }

  return vwap
}
export function calculateVolumeRatio(data, period = 5) {
  const volumeRatio = []

  for (let i = period - 1; i < data.length; i++) {
    const pastVolumes = data.slice(i - period + 1, i + 1).map((d) => d.volume)
    const avgVolume = pastVolumes.reduce((a, b) => a + b, 0) / period
    const ratio = data[i].volume / avgVolume
    volumeRatio.push(ratio)
  }

  return Array(period - 1)
    .fill(null)
    .concat(volumeRatio)
}
// 注意：委比需要买卖盘数据，通常需要实时行情数据
export function calculateCommissionRatio(buyVolumes, sellVolumes) {
  const totalBuy = buyVolumes.reduce((a, b) => a + b, 0)
  const totalSell = sellVolumes.reduce((a, b) => a + b, 0)

  return ((totalBuy - totalSell) / (totalBuy + totalSell)) * 100
}
export function calculateDMI(data, period = 14) {
  const tr = [data[0].high - data[0].low] // 真实波幅
  const plusDM = [0] // +DM
  const minusDM = [0] // -DM

  for (let i = 1; i < data.length; i++) {
    const upMove = data[i].high - data[i - 1].high
    const downMove = data[i - 1].low - data[i].low

    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0)
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0)

    const tr1 = data[i].high - data[i].low
    const tr2 = Math.abs(data[i].high - data[i - 1].close)
    const tr3 = Math.abs(data[i].low - data[i - 1].close)
    tr.push(Math.max(tr1, tr2, tr3))
  }

  // 计算14日平滑值
  const plusDI = []
  const minusDI = []
  const dx = []
  const adx = Array(2 * period - 1).fill(null)

  for (let i = period - 1; i < data.length; i++) {
    const sliceTR = tr.slice(i - period + 1, i + 1)
    const slicePlusDM = plusDM.slice(i - period + 1, i + 1)
    const sliceMinusDM = minusDM.slice(i - period + 1, i + 1)

    const sumTR = sliceTR.reduce((a, b) => a + b, 0)
    const sumPlusDM = slicePlusDM.reduce((a, b) => a + b, 0)
    const sumMinusDM = sliceMinusDM.reduce((a, b) => a + b, 0)

    const plusDICurrent = (sumPlusDM / sumTR) * 100
    const minusDICurrent = (sumMinusDM / sumTR) * 100

    plusDI.push(plusDICurrent)
    minusDI.push(minusDICurrent)

    const dxCurrent =
      (Math.abs(plusDICurrent - minusDICurrent) / (plusDICurrent + minusDICurrent)) * 100
    dx.push(dxCurrent)
  }

  // 计算ADX (DX的14日平均)
  for (let i = period; i < dx.length; i++) {
    const sliceDX = dx.slice(i - period + 1, i + 1)
    const avgDX = sliceDX.reduce((a, b) => a + b, 0) / period
    adx.push(avgDX)
  }

  return {
    plusDI: Array(period - 1)
      .fill(null)
      .concat(plusDI),
    minusDI: Array(period - 1)
      .fill(null)
      .concat(minusDI),
    adx,
  }
}
export function calculateATR(data, period = 14) {
  const tr = [data[0].high - data[0].low] // 真实波幅

  for (let i = 1; i < data.length; i++) {
    const tr1 = data[i].high - data[i].low
    const tr2 = Math.abs(data[i].high - data[i - 1].close)
    const tr3 = Math.abs(data[i].low - data[i - 1].close)
    tr.push(Math.max(tr1, tr2, tr3))
  }

  // 计算ATR
  const atr = Array(period - 1).fill(null)

  let sum = tr.slice(0, period).reduce((a, b) => a + b, 0)
  atr.push(sum / period)

  for (let i = period; i < tr.length; i++) {
    sum = atr[i - 1] * (period - 1) + tr[i]
    atr.push(sum / period)
  }

  return atr
}
export function calculateWilliamsR(data, period = 14) {
  const williamsR = []

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const highestHigh = Math.max(...slice.map((d) => d.high))
    const lowestLow = Math.min(...slice.map((d) => d.low))
    const close = data[i].close

    const r = ((highestHigh - close) / (highestHigh - lowestLow)) * -100
    williamsR.push(r)
  }

  return Array(period - 1)
    .fill(null)
    .concat(williamsR)
}
