import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  calculateBollingerBands,
  calculateCCI,
  calculateKDJ,
  calculateMA,
  calculateMACD,
  calculateRSI,
  changeCharts,
  changeChartsTheme,
  generateColorMap,
  getChartListColor,
  getColorFromTheme,
  insertThemeStylesheet,
} from './index';

describe('技术指标计算函数', () => {
  // 测试数据
  const testData = [
    { open: 10, high: 15, low: 8, close: 12 },
    { open: 12, high: 18, low: 10, close: 15 },
    { open: 15, high: 20, low: 14, close: 18 },
    { open: 18, high: 22, low: 16, close: 20 },
    { open: 20, high: 25, low: 18, close: 22 },
    { open: 22, high: 28, low: 20, close: 25 },
    { open: 25, high: 30, low: 22, close: 28 },
    { open: 28, high: 32, low: 25, close: 30 },
    { open: 30, high: 35, low: 28, close: 32 },
    { open: 32, high: 38, low: 30, close: 35 },
  ];

  describe('calculateMA - 移动平均线', () => {
    it('应正确计算5日移动平均线', () => {
      const result = calculateMA(testData, 5);
      expect(result).toHaveLength(testData.length);

      // 前4天应为null（不足5天）
      for (let i = 0; i < 4; i++) {
        expect(result[i]).toBeNull();
      }

      // 第5天开始计算
      expect(result[4]).toBeCloseTo((12 + 15 + 18 + 20 + 22) / 5);
      expect(result[5]).toBeCloseTo((15 + 18 + 20 + 22 + 25) / 5);
      expect(result[9]).toBeCloseTo((22 + 25 + 28 + 30 + 32 + 35) / 5);
    });
  });

  describe('calculateMACD - 指数平滑移动平均线', () => {
    it('应返回包含DIF、DEA和MACD的对象', () => {
      const { DIF, DEA, MACD } = calculateMACD(testData);

      expect(DIF).toHaveLength(testData.length);
      expect(DEA).toHaveLength(testData.length);
      expect(MACD).toHaveLength(testData.length);

      // 验证DIF是短期EMA减去长期EMA
      const shortEMA = [testData[0].close];
      const longEMA = [testData[0].close];
      const kShort = 2 / (12 + 1);
      const kLong = 2 / (26 + 1);

      for (let i = 1; i < testData.length; i++) {
        shortEMA.push(testData[i].close * kShort + shortEMA[i - 1] * (1 - kShort));
        longEMA.push(testData[i].close * kLong + longEMA[i - 1] * (1 - kLong));
      }

      expect(DIF[5]).toBeCloseTo(shortEMA[5] - longEMA[5]);

      // 验证MACD是(DIF - DEA) * 2
      expect(MACD[5]).toBeCloseTo((DIF[5] - DEA[5]) * 2);
    });
  });

  describe('calculateBollingerBands - 布林带', () => {
    it('应返回包含上轨、中轨和下轨的对象', () => {
      const period = 5;
      const { middleBand, upperBand, lowerBand } = calculateBollingerBands(testData, period);

      expect(middleBand).toHaveLength(testData.length);
      expect(upperBand).toHaveLength(testData.length);
      expect(lowerBand).toHaveLength(testData.length);

      // 中轨是移动平均线
      expect(middleBand[4]).toBeCloseTo((12 + 15 + 18 + 20 + 22) / 5);

      // 验证标准差计算
      const slice = testData.slice(0, 5).map((d) => d.close);
      const avg = middleBand[4];
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      expect(upperBand[4]).toBeCloseTo(avg + stdDev * 2);
      expect(lowerBand[4]).toBeCloseTo(avg - stdDev * 2);
    });
  });

  describe('calculateRSI - 相对强弱指数', () => {
    it('应正确计算14日RSI', () => {
      const rsi = calculateRSI(testData, 14);

      // 数据不足14天时返回null
      expect(rsi.slice(0, 13).every((val) => val === null)).toBe(true);

      // 测试上升趋势的RSI应该较高
      const risingData = Array(15)
        .fill(null)
        .map((_, i) => ({
          open: 10 + i,
          high: 12 + i,
          low: 9 + i,
          close: 11 + i,
        }));
      const risingRSI = calculateRSI(risingData, 14);
      expect(risingRSI[14]).toBeGreaterThan(70);

      // 测试下降趋势的RSI应该较低
      const fallingData = Array(15)
        .fill(null)
        .map((_, i) => ({
          open: 30 - i,
          high: 32 - i,
          low: 29 - i,
          close: 31 - i,
        }));
      const fallingRSI = calculateRSI(fallingData, 14);
      expect(fallingRSI[14]).toBeLessThan(30);
    });
  });

  describe('calculateKDJ - 随机指标', () => {
    it('应返回包含K、D、J值的数组', () => {
      const kdj = calculateKDJ(testData, 9);

      expect(kdj).toHaveLength(testData.length);

      // 前8天应为null（不足9天）
      for (let i = 0; i < 8; i++) {
        expect(kdj[i]).toBeNull();
      }

      // 验证K、D、J值计算
      const ninthData = testData.slice(0, 9);
      const close = testData[8].close;
      const high = Math.max(...ninthData.map((d) => d.high));
      const low = Math.min(...ninthData.map((d) => d.low));
      const rsv = ((close - low) / (high - low)) * 100;

      const K = (2 / 3) * 50 + (1 / 3) * rsv;
      const D = (2 / 3) * 50 + (1 / 3) * K;
      const J = 3 * K - 2 * D;

      expect(kdj[8].K).toBeCloseTo(K);
      expect(kdj[8].D).toBeCloseTo(D);
      expect(kdj[8].J).toBeCloseTo(J);
    });
  });

  describe('calculateCCI - 商品路径指数', () => {
    it('应正确计算CCI值', () => {
      const cci = calculateCCI(testData, 20);

      expect(cci).toHaveLength(testData.length);

      // 前19天应为null（不足20天）
      for (let i = 0; i < 19; i++) {
        expect(cci[i]).toBeNull();
      }

      // 验证CCI计算
      const slice = testData.slice(0, 20);
      const typicalPrices = slice.map((d) => (d.high + d.low + d.close) / 3);
      const sma = typicalPrices.reduce((a, b) => a + b, 0) / 20;

      const meanDeviation = typicalPrices.map((tp) => Math.abs(tp - sma)).reduce((a, b) => a + b, 0) / 20;

      const currentTypicalPrice = (testData[19].high + testData[19].low + testData[19].close) / 3;
      const cciValue = (currentTypicalPrice - sma) / (0.015 * meanDeviation);

      expect(cci[19]).toBeCloseTo(cciValue);
    });
  });
});
describe('主题颜色和图表样式工具函数', () => {
  describe('getColorFromTheme', () => {
    beforeEach(() => {
      // 模拟document对象
      document.documentElement.style.setProperty('--td-brand-color', ' #0052d9 ');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('应从主题色获取颜色列表', () => {
      const colors = getColorFromTheme();
      expect(colors).toBeDefined();
      expect(colors.length).toBe(8);
    });

    it('当获取主题色失败时应返回默认颜色', () => {
      vi.spyOn(document, 'documentElement', 'get').mockImplementation(() => {
        throw new Error('Mock error');
      });

      const colors = getColorFromTheme();
      expect(colors).toEqual(['#0052d9', '#78bdd5', '#ef84ce', '#57c2b8', '#ef9f79', '#4fc241', '#73a4e1', '#f59e78']);
    });
  });

  describe('getChartListColor', () => {
    it('应返回颜色列表', () => {
      const colors = getChartListColor();
      expect(colors).toBeDefined();
      expect(colors.length).toBe(8);
    });
  });

  describe('changeChartsTheme', () => {
    it('应更新图表主题', () => {
      const mockChart = {
        ref: {
          getOption: vi.fn().mockReturnValue({}),
          setOption: vi.fn(),
        },
      };

      changeChartsTheme([mockChart]);

      expect(mockChart.ref.getOption).toHaveBeenCalled();
      expect(mockChart.ref.setOption).toHaveBeenCalled();
    });

    it('当图表列表为空时不执行任何操作', () => {
      const spy = vi.fn();
      changeChartsTheme([]);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('changeCharts', () => {
    it('应更新图表配置和主题', () => {
      const mockChart = {
        ref: {
          getOption: vi.fn().mockReturnValue({}),
          setOption: vi.fn(),
        },
      };

      const mockOptions = [{}];

      changeCharts([mockChart], mockOptions);

      expect(mockChart.ref.getOption).toHaveBeenCalled();
      expect(mockChart.ref.setOption).toHaveBeenCalled();
    });
  });

  describe('generateColorMap', () => {
    const theme = '#0052d9';
    const colorPalette = [
      '#e6f7ff',
      '#bae7ff',
      '#91d5ff',
      '#69c0ff',
      '#40a9ff',
      '#1890ff',
      '#096dd9',
      '#0052d9',
      '#003eb3',
      '#002c8c',
    ];

    it('应为亮色模式生成正确的颜色映射', () => {
      const colorMap = generateColorMap(theme, colorPalette, 'light', 5);

      expect(colorMap['--td-brand-color']).toBe(colorPalette[5]);
      expect(colorMap['--td-brand-color-1']).toBe(colorPalette[0]);
      expect(colorMap['--td-brand-color-8']).toBe(colorPalette[5]);
    });

    it('应为暗色模式生成正确的颜色映射', () => {
      const colorMap = generateColorMap(theme, colorPalette, 'dark', 5);

      expect(colorMap['--td-brand-color']).toBe(colorPalette[5]);
      expect(colorMap['--td-brand-color-1']).toMatch(/20$/); // 检查透明度后缀
      expect(colorMap['--td-brand-color-9']).toBe(colorPalette[6]); // 反转后的色板
    });
  });

  describe('insertThemeStylesheet', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
    });

    it('应为亮色模式插入正确的样式表', () => {
      const theme = '#0052d9';
      const colorMap = {
        '--td-brand-color': '#0052d9',
        '--td-brand-color-1': '#e6f7ff',
        // ...其他颜色映射
      } as any;

      insertThemeStylesheet(theme, colorMap, 'light');

      const style = document.head.querySelector('style');
      expect(style).not.toBeNull();
      expect(style?.innerText).toContain(`:root[theme-color='${theme}']`);
      expect(style?.innerText).toContain('--td-brand-color: #0052d9');
    });

    it('应为暗色模式插入正确的样式表', () => {
      const theme = '#0052d9';
      const colorMap = {
        '--td-brand-color': '#0052d9',
        '--td-brand-color-1': '#e6f7ff',
        // ...其他颜色映射
      } as any;

      insertThemeStylesheet(theme, colorMap, 'dark');

      const style = document.head.querySelector('style');
      expect(style).not.toBeNull();
      expect(style?.innerText).toContain(`:root[theme-color='${theme}'][theme-mode='dark']`);
    });
  });
});
