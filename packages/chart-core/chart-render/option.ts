import {
  calculateBollingerBands,
  calculateCCI,
  calculateKDJ,
  calculateMA,
  calculateMACD,
  calculateRSI,
} from '../data-transformer/index';
import { Sampler } from './dynamicSampling';

/**
 * 主题配置相关常量
 */
const DEFAULT_COLORS = ['#0052d9', '#78bdd5', '#ef84ce', '#57c2b8', '#ef9f79', '#4fc241', '#73a4e1', '#f59e78'];

/**
 * 获取图表主题配置
 * @param options 主题配置选项
 * @returns 图表主题配置对象
 */
export const getChartThemeOption = ({ borderColor, containerColor, textColor }) => ({
  backgroundColor: containerColor,
  textStyle: {
    color: textColor,
  },
  grid: {
    borderColor: borderColor,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: borderColor,
      },
    },
    axisLabel: {
      color: textColor,
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: borderColor,
      },
    },
    axisLabel: {
      color: textColor,
    },
  },
  tooltip: {
    textStyle: {
      color: textColor,
    },
    backgroundColor: containerColor,
    borderColor: borderColor,
  },
});

/**
 * 获取图表颜色配置
 * @param colorList 颜色列表
 * @returns 图表颜色配置对象
 */
export const getChartColorOption = (colorList) => {
  const colors = colorList?.length ? colorList : DEFAULT_COLORS;

  return {
    color: colors,
    series: [
      {
        lineStyle: {
          color: colors[0],
        },
        itemStyle: {
          color: colors[0],
        },
        areaStyle: colorList?.length
          ? undefined
          : {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                  { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
                ],
              },
            },
      },
      {
        lineStyle: {
          color: colors[1],
        },
        itemStyle: {
          color: colors[1],
        },
      },
    ],
  };
};

/**
 * 获取趋势图颜色配置
 * @param colorList 颜色列表
 * @returns 趋势图颜色配置对象
 */
export const getTrendingChartColorOption = (colorList) => {
  const colors = colorList?.length ? colorList : DEFAULT_COLORS;

  return {
    color: colors,
    series: Array.from({ length: 4 }, (_, i) => ({
      lineStyle: {
        color: colors[i],
      },
    })),
  };
};

/**
 * 获取震荡图颜色配置
 * @param colorList 颜色列表
 * @returns 震荡图颜色配置对象
 */
export const getShockChartColorOption = (colorList) => {
  const colors = colorList?.length ? colorList : DEFAULT_COLORS;

  return {
    color: colors,
    series: Array.from({ length: 2 }, (_, i) => ({
      lineStyle: {
        color: colors[i],
      },
    })),
  };
};

/**
 * 格式化数字为万/亿单位
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 */
function formatNumberToWan(num) {
  // 处理非数字或无效输入
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  // 处理负数
  const isNegative = num < 0;
  const absoluteNum = Math.abs(num);

  // 处理亿级数字（>=1亿）
  if (absoluteNum >= 100000000) {
    const yiValue = absoluteNum / 100000000;
    const formattedYi = Math.floor(yiValue * 10) / 10; // 保留1位小数
    const isWholeYi = absoluteNum % 100000000 === 0;
    const displayValue = isWholeYi ? yiValue.toLocaleString('en-US') : formattedYi.toLocaleString('en-US');
    return `${isNegative ? '-' : ''}${displayValue}亿`;
  }

  // 处理万级数字（>=1万）
  if (absoluteNum >= 10000) {
    const wanValue = absoluteNum / 10000;
    const formattedWan = Math.floor(wanValue); // 直接取整，不保留小数
    return `${isNegative ? '-' : ''}${formattedWan.toLocaleString('en-US')}万`;
  }

  // 小于1万的情况
  return `${isNegative ? '-' : ''}${absoluteNum.toLocaleString('en-US')}`;
}

/**
 * 创建通用的图表配置
 * @param data 数据
 * @param interval 间隔
 * @returns 基础图表配置
 */
const createBaseChartConfig = (data, interval = 4) => ({
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    data: data.map((item) => item.date),
    type: 'category',
    axisLabel: {
      interval: Math.floor(data.length / interval),
    },
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
    {
      type: 'slider',
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
  ],
});

/**
 * 创建辅助线配置
 * @param dataLength 数据长度
 * @param value 辅助线值
 * @param color 辅助线颜色
 * @returns 辅助线配置
 */
const createAuxiliaryLine = (dataLength, value, color = '#f6685d') => ({
  name: '辅助线',
  type: 'line',
  data: Array(dataLength).fill(value),
  lineStyle: {
    color,
    type: 'dashed',
    width: 1,
  },
  symbol: 'none',
  silent: true,
});

/**
 * 获取股票图表配置
 * @param stockData 股票数据
 * @param currency 货币单位
 * @returns 股票图表配置
 */
export const getStockChartOptions = (stockData, currency = '') => {
  return {
    xAxis: {
      data: stockData.data.map((item) => item.date),
      type: 'category',
      axisLabel: {
        interval: Math.floor(stockData.data.length / 4),
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (params[0].data.close) {
          const data = params[0].data;
          return `
        <div><strong>${currency} $${data.close}</strong></div>
        <div>${params[0].axisValueLabel}</div>
        <div>成交量：${formatNumberToWan(data.volume)}</div>
      `;
        } else {
          return '午休';
        }
      },
    },
    yAxis: [
      {
        scale: true,
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        data: stockData.data.map((item) => ({
          value: item.close,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        })),
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
  };
};

/**
 * 获取趋势图表配置
 * @param data 数据
 * @param name 指标名称
 * @returns 趋势图表配置
 */
export const getTrendingChartOptions = (data, name) => {
  const chartData = data.data;
  const baseConfig = createBaseChartConfig(chartData);

  switch (name) {
    case 'MACD': {
      const stockData = calculateMACD(chartData);
      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            let result = `<div style="font-weight:bold">${params[0].axisValue}</div>`;
            params.forEach((item) => {
              const color = item.color;
              let value = item.value;
              const seriesName = item.seriesName;

              if (seriesName === 'MACD') {
                value = Number(value).toFixed(2);
                value = value >= 0 ? '+' + value : value;
              } else {
                value = Number(value).toFixed(2);
              }

              result += `
                <div style="display:flex;align-items:center;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                  ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                </div>
              `;
            });
            return result;
          },
        },
        legend: {
          data: ['DIF', 'DEA', 'MACD'],
          bottom: 10,
        },
        yAxis: [
          {
            name: 'DIF/DEA',
            type: 'value',
            scale: true,
            splitLine: { show: true },
          },
          {
            name: 'MACD',
            type: 'value',
            scale: true,
            splitLine: { show: false },
          },
        ],
        series: [
          {
            name: 'DIF',
            type: 'line',
            data: stockData.DIF.map((v) => v.toFixed(2)),
            smooth: true,
            lineStyle: { width: 2, color: '#0052d9' },
            symbol: 'none',
          },
          {
            name: 'DEA',
            type: 'line',
            data: stockData.DEA.map((v) => v.toFixed(2)),
            smooth: true,
            lineStyle: { width: 2, color: '#78bdd5' },
            symbol: 'none',
          },
          {
            name: 'MACD',
            type: 'bar',
            yAxisIndex: 1,
            data: stockData.MACD.map((v) => v.toFixed(2)),
            itemStyle: {
              color: (params) => (params.value >= 0 ? '#f6685d' : '#56c08d'),
            },
            barWidth: '60%',
          },
          createAuxiliaryLine(chartData.length, 70),
        ],
      };
    }

    case 'MA(5)': {
      const ma5Data = calculateMA(chartData, 5);
      const ma10Data = calculateMA(chartData, 10);

      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].axisValue}</div>`;

            // K线数据处理
            const candle = params[0].data;
            result += `
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0].color};margin-right:5px;"></span>
                开盘: <span style="margin-left:5px;font-weight:bold">${candle[0]}</span>
              </div>
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0].color};margin-right:5px;"></span>
                收盘: <span style="margin-left:5px;font-weight:bold">${candle[1]}</span>
              </div>
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0].color};margin-right:5px;"></span>
                最低: <span style="margin-left:5px;font-weight:bold">${candle[2]}</span>
              </div>
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0].color};margin-right:5px;"></span>
                最高: <span style="margin-left:5px;font-weight:bold">${candle[3]}</span>
              </div>
            `;

            // 处理均线数据
            for (let i = 1; i < params.length; i++) {
              if (params[i].seriesName.includes('MA')) {
                const color = params[i].color;
                const seriesName = params[i].seriesName;
                let value = params[i].value;

                // 格式化数值，保留2位小数
                value = typeof value === 'number' ? value.toFixed(2) : '—';

                result += `
                  <div style="display:flex;align-items:center;margin:3px 0;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                    ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                  </div>
                `;
              }
            }

            return result;
          },
        },
        legend: {
          data: ['K线', 'MA5'],
          bottom: 10,
        },
        yAxis: { type: 'value', scale: true },
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: chartData.map((item) => [item.open, item.close, item.low, item.high]),
            itemStyle: {
              color: '#ef5350',
              color0: '#26a69a',
              borderColor: '#ef5350',
              borderColor0: '#26a69a',
              borderWidth: 2,
            },
            barWidth: '80%',
          },
          {
            name: 'MA5',
            type: 'line',
            data: ma5Data,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2 },
          },
          {
            name: 'MA10',
            type: 'line',
            data: ma10Data,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2 },
          },
          createAuxiliaryLine(chartData.length, 500),
        ],
      };
    }

    case 'MA(20)': {
      const ma20Data = calculateMA(chartData, 20);
      const ma10Data = calculateMA(chartData, 10);

      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            if (!params || !Array.isArray(params) || params.length === 0) {
              return '';
            }

            let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0]?.axisValue || '—'}</div>`;

            // K线数据处理
            const candle = params[0]?.data || [];
            result += `
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0]?.color || '#000'};margin-right:5px;"></span>
                开盘: <span style="margin-left:5px;font-weight:bold">${candle[0] ?? '—'}</span>
              </div>
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0]?.color || '#000'};margin-right:5px;"></span>
                收盘: <span style="margin-left:5px;font-weight:bold">${candle[1] ?? '—'}</span>
              </div>
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0]?.color || '#000'};margin-right:5px;"></span>
                最低: <span style="margin-left:5px;font-weight:bold">${candle[2] ?? '—'}</span>
              </div>
              <div style="display:flex;align-items:center;margin:3px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params[0]?.color || '#000'};margin-right:5px;"></span>
                最高: <span style="margin-left:5px;font-weight:bold">${candle[3] ?? '—'}</span>
              </div>
            `;

            // 处理均线数据
            for (let i = 1; i < params.length; i++) {
              if (params[i] && params[i].seriesName && params[i].seriesName.includes('MA')) {
                const color = params[i].color || '#000';
                const seriesName = params[i].seriesName;
                const value = typeof params[i].data === 'number' ? params[i].data.toFixed(2) : '—';

                result += `
                  <div style="display:flex;align-items:center;margin:3px 0;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                    ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                  </div>
                `;
              }
            }

            return result;
          },
        },
        legend: {
          data: ['K线', 'MA20'],
          bottom: 10,
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: chartData.map((item) => [item.open, item.close, item.low, item.high]),
            itemStyle: {
              color: '#ef5350',
              color0: '#26a69a',
              borderColor: '#ef5350',
              borderColor0: '#26a69a',
              borderWidth: 2,
            },
            barWidth: '70%',
          },
          {
            name: 'MA20',
            type: 'line',
            data: ma20Data,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2 },
          },
          {
            name: 'MA10',
            type: 'line',
            data: ma10Data,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2 },
          },
          createAuxiliaryLine(chartData.length, 70),
        ],
      };
    }

    case '布林带': {
      const stockData = calculateBollingerBands(chartData);

      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            const date = params[0].axisValue;
            let tooltipContent = `<div style="font-weight:bold;margin-bottom:5px;">${date}</div>`;

            params.forEach((item) => {
              const color = item.color;
              const seriesName = item.seriesName;
              let value = item.value;

              if (typeof value === 'number') {
                value = value.toFixed(2);
              }

              tooltipContent += `
                <div style="display:flex;align-items:center;margin:3px 0;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                  ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                </div>
              `;
            });

            return tooltipContent;
          },
        },
        legend: {
          data: ['收盘价', '中轨(MA)', '上轨', '下轨'],
          bottom: 10,
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: (value) => value.toFixed(2),
          },
        },
        series: [
          {
            name: '收盘价',
            type: 'line',
            data: chartData.map((item) => item.close),
            lineStyle: { width: 2 },
            symbol: 'none',
          },
          {
            name: '中轨(MA)',
            type: 'line',
            data: stockData.middleBand,
            lineStyle: {
              color: '#FF9800',
              width: 2,
            },
            symbol: 'none',
          },
          {
            name: '上轨',
            type: 'line',
            data: stockData.upperBand,
            lineStyle: {
              color: '#F44336',
              width: 2,
            },
            areaStyle: {
              color: 'rgba(244, 67, 54, 0.05)',
            },
            symbol: 'none',
          },
          {
            name: '下轨',
            type: 'line',
            data: stockData.lowerBand,
            lineStyle: {
              color: '#4CAF50',
              width: 2,
            },
            areaStyle: {
              color: 'rgba(76, 175, 80, 0.05)',
            },
            symbol: 'none',
          },
        ],
      };
    }

    default:
      return baseConfig;
  }
};

/**
 * 获取震荡图表配置
 * @param data 数据
 * @param name 指标名称
 * @returns 震荡图表配置
 */
export const getShockChartOptions = (data, name) => {
  const chartData = data.data;
  const baseConfig = createBaseChartConfig(chartData);

  switch (name) {
    case 'RSI': {
      const stockData = calculateRSI(chartData);

      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            let result = `<div style="font-weight:bold">${params[0].axisValue}</div>`;
            params.forEach((item) => {
              const color = item.color;
              let value = item.value;
              const seriesName = item.seriesName;

              // RSI值显示两位小数
              value = Number(value).toFixed(2);

              result += `
                <div style="display:flex;align-items:center;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                  ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                </div>
              `;
            });
            return result;
          },
        },
        legend: {
          data: ['RSI'],
          bottom: 10,
        },
        yAxis: {
          name: 'RSI',
          type: 'value',
          scale: true,
          splitLine: { show: true },
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: 'RSI',
            type: 'line',
            data: stockData.map((v) => (v ? v.toFixed(2) : null)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#0052d9',
            },
            symbol: 'none',
          },
          createAuxiliaryLine(chartData.length, 70, '#f6685d'),
          createAuxiliaryLine(chartData.length, 30, '#56c08d'),
        ],
      };
    }

    case 'KDJ': {
      const stockData = calculateKDJ(chartData);

      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            let result = `<div style="font-weight:bold">${params[0].axisValue}</div>`;
            params.forEach((item) => {
              const color = item.color;
              let value = item.value;
              const seriesName = item.seriesName;

              // KDJ值显示两位小数
              value = Number(value).toFixed(2);

              result += `
                <div style="display:flex;align-items:center;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                  ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                </div>
              `;
            });
            return result;
          },
        },
        legend: {
          data: ['K', 'D', 'J'],
          bottom: 10,
        },
        yAxis: {
          name: 'KDJ',
          type: 'value',
          scale: true,
          splitLine: { show: true },
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: 'K',
            type: 'line',
            data: stockData.map((v) => (v ? v.K.toFixed(2) : null)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#0052d9',
            },
            symbol: 'none',
          },
          {
            name: 'D',
            type: 'line',
            data: stockData.map((v) => (v ? v.D.toFixed(2) : null)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#78bdd5',
            },
            symbol: 'none',
          },
          {
            name: 'J',
            type: 'line',
            data: stockData.map((v) => (v ? v.J.toFixed(2) : null)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#f6685d',
            },
            symbol: 'none',
          },
        ],
      };
    }

    case 'CCI': {
      const stockData = calculateCCI(chartData);

      return {
        ...baseConfig,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function (params) {
            let result = `<div style="font-weight:bold">${params[0].axisValue}</div>`;
            params.forEach((item) => {
              const color = item.color;
              let value = item.value;
              const seriesName = item.seriesName;

              // CCI值显示两位小数
              value = Number(value).toFixed(2);

              result += `
                <div style="display:flex;align-items:center;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
                  ${seriesName}: <span style="margin-left:5px;font-weight:bold">${value}</span>
                </div>
              `;
            });
            return result;
          },
        },
        legend: {
          data: ['CCI'],
          bottom: 10,
        },
        yAxis: {
          name: 'CCI',
          type: 'value',
          scale: true,
          splitLine: { show: true },
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: 'CCI',
            type: 'line',
            data: stockData.map((v) => (v ? v.toFixed(2) : null)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#0052d9',
            },
            symbol: 'none',
          },
          createAuxiliaryLine(chartData.length, 70, '#f6685d'),
          createAuxiliaryLine(chartData.length, 30, '#56c08d'),
        ],
      };
    }

    default:
      return baseConfig;
  }
};

/**
 * 获取初始图表配置
 * @param stockData 股票数据
 * @returns 初始图表配置数组
 */
export const getInitialOptions = (stockData) => {
  if (stockData.data.length > 100000) {
    const sampledData = Sampler.sampleByRatio(stockData, 0.4);
    return [
      getStockChartOptions(sampledData, 'HKD'),
      getTrendingChartOptions(sampledData, 'MA(5)'),
      getShockChartOptions(sampledData, 'RSI'),
    ];
  }

  return [
    getStockChartOptions(stockData, 'HKD'),
    getTrendingChartOptions(stockData, 'MA(5)'),
    getShockChartOptions(stockData, 'RSI'),
  ];
};

/**
 * 获取自定义图表配置
 * @param stockData 股票数据
 * @param options 自定义选项
 * @returns 自定义图表配置数组
 */
export const getOptions = (stockData, options) => {
  if (stockData.data.length > 100000) {
    const sampledData = Sampler.sampleByRatio(stockData, 0.4);
    return [
      getStockChartOptions(sampledData, 'HKD'),
      getTrendingChartOptions(sampledData, options[0]),
      getShockChartOptions(sampledData, options[1]),
    ];
  }

  return [
    getStockChartOptions(stockData, 'HKD'),
    getTrendingChartOptions(stockData, options[0]),
    getShockChartOptions(stockData, options[1]),
  ];
};
