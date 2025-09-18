import { describe, expect, it } from 'vitest';

import {
  calculateIndicators,
  calculatePositionPeriod,
  calculatePositionUtilizationRate,
  calculateVolatility,
  getSignal,
  shouldStopLoss,
  shouldTrailingStop,
} from './index'; // 请替换为实际文件路径

describe('交易信号函数测试', () => {
  describe('getSignal - MA交叉策略', () => {
    const strategy = 'ma_cross';
    const params = { shortPeriod: 5, longPeriod: 20 };

    it('应该返回BUY当短期均线上穿长期均线', () => {
      const today = {};
      const yesterday = {};
      const index = 21; // 大于longPeriod
      const indicators = {
        shortMA: [null, ...Array(19).fill(10), 11, 12], // 前一日10，当日12
        longMA: [null, ...Array(19).fill(11), 11, 11], // 前一日11，当日11
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('BUY');
    });

    it('应该返回SELL当短期均线下穿长期均线', () => {
      const today = {};
      const yesterday = {};
      const index = 21;
      const indicators = {
        shortMA: [null, ...Array(19).fill(12), 11, 10], // 前一日11，当日10
        longMA: [null, ...Array(19).fill(11), 11, 11], // 前一日11，当日11
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('SELL');
    });

    it('应该返回HOLD当没有交叉发生时', () => {
      const today = {};
      const yesterday = {};
      const index = 21;
      const indicators = {
        shortMA: [null, ...Array(19).fill(10), 10, 10], // 没有变化
        longMA: [null, ...Array(19).fill(11), 11, 11], // 没有变化
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('HOLD');
    });
  });

  describe('getSignal - RSI反转策略', () => {
    const strategy = 'rsi_reversal';
    const params = { oversold: 30, overbought: 70, buffer: 5 };

    it('应该返回BUY当RSI从超卖区回升', () => {
      const today = {};
      const yesterday = {};
      const index = 1;
      const indicators = {
        rsi: [null, 34, 36], // 前一日34(<=35)，当日36(>35)
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('BUY');
    });

    it('应该返回SELL当RSI从超买区回落', () => {
      const today = {};
      const yesterday = {};
      const index = 1;
      const indicators = {
        rsi: [null, 66, 64], // 前一日66(>=65)，当日64(<65)
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('SELL');
    });
  });

  describe('getSignal - 布林带策略', () => {
    const strategy = 'bollinger_bands';
    const params = { buffer: 0.1 };

    it('应该返回BUY当价格接近下轨且反弹', () => {
      const today = { close: 12 };
      const yesterday = { close: 10 };
      const index = 1;
      const indicators = {
        upper: [null, 20],
        lower: [null, 10],
        middle: [null, 15],
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('BUY');
    });

    it('应该返回SELL当价格接近上轨且回落', () => {
      const today = { close: 18 };
      const yesterday = { close: 20 };
      const index = 1;
      const indicators = {
        upper: [null, 20],
        lower: [null, 10],
        middle: [null, 15],
      };

      const signal = getSignal(today, yesterday, indicators, index, strategy, params);
      expect(signal).toBe('SELL');
    });
  });

  describe('止损止盈函数', () => {
    it('shouldStopLoss - 应该止损当损失超过阈值', () => {
      expect(shouldStopLoss(90, 100, { stopLossLimit: 10 })).toBe(true);
      expect(shouldStopLoss(91, 100, { stopLossLimit: 10 })).toBe(false);
    });

    it('shouldTrailingStop - 应该止盈当回撤超过阈值', () => {
      expect(shouldTrailingStop(90, 100, { trailingStopPercent: 10 })).toBe(true);
      expect(shouldTrailingStop(91, 100, { trailingStopPercent: 10 })).toBe(false);
    });
  });

  describe('统计计算函数', () => {
    it('calculateVolatility - 计算波动率', () => {
      const returns = [0.01, -0.02, 0.03, -0.01, 0.02];
      const vol = calculateVolatility(returns);
      expect(vol).toBeCloseTo(0.158, 2);
    });

    it('calculatePositionPeriod - 计算平均持仓周期', () => {
      const trades = [{ date: '2023-01-01' }, { date: '2023-01-11' }, { date: '2023-02-01' }, { date: '2023-02-06' }];
      expect(calculatePositionPeriod(trades)).toBe(8); // (10 + 5) / 2 = 7.5 四舍五入为8
    });

    it('calculatePositionUtilizationRate - 计算仓位利用率', () => {
      const equityCurve = [{ value: 11000 }, { value: 12000 }, { value: 10500 }];
      expect(calculatePositionUtilizationRate(equityCurve, 10000)).toBeCloseTo(16.666, 2);
    });
  });
});

describe('技术指标计算函数测试', () => {
  const testData = [
    { close: 10 },
    { close: 11 },
    { close: 12 },
    { close: 13 },
    { close: 14 },
    { close: 15 },
    { close: 14 },
    { close: 13 },
    { close: 12 },
    { close: 11 },
  ];

  describe('calculateIndicators - MA交叉策略', () => {
    it('应该计算短期和长期均线', () => {
      const result = calculateIndicators(testData, { shortPeriod: 3, longPeriod: 5 }, 'ma_cross');
      expect(result.shortMA).toHaveLength(10);
      expect(result.longMA).toHaveLength(10);
      expect(result.shortMA[9]).toBeCloseTo((12 + 13 + 14) / 3);
      expect(result.longMA[9]).toBeCloseTo((11 + 12 + 13 + 14 + 15) / 5);
    });
  });

  describe('calculateIndicators - RSI策略', () => {
    it('应该计算RSI', () => {
      const result = calculateIndicators(testData, { rsiPeriod: 3 }, 'rsi_reversal');
      expect(result.rsi).toHaveLength(10);
      // 精确值取决于RSI计算逻辑
      expect(result.rsi[9]).toBeDefined();
    });
  });

  describe('calculateIndicators - 布林带策略', () => {
    it('应该计算布林带', () => {
      const result = calculateIndicators(
        testData,
        { bollingerBandsPeriod: 5, standardDeviationMultiple: 2 },
        'bollinger_bands',
      );
      expect(result.upper).toHaveLength(10);
      expect(result.middle).toHaveLength(10);
      expect(result.lower).toHaveLength(10);
      // 中间带应该是5日均线
      expect(result.middle[9]).toBeCloseTo((11 + 12 + 13 + 14 + 15) / 5);
    });
  });
});
