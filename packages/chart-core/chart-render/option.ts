import {
  calculateBollingerBands,
  calculateCCI,
  calculateKDJ,
  calculateMA,
  calculateMACD,
  calculateRSI,
} from '../data-transformer/index';
export const getChartThemeOption = ({ borderColor, containerColor, textColor }) => {
  return {
    backgroundColor: containerColor, // 容器背景色
    textStyle: {
      color: textColor, // 全局文本颜色
    },
    grid: {
      borderColor: borderColor, // 图表网格边框颜色
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor, // X 轴线颜色
        },
      },
      axisLabel: {
        color: textColor, // X 轴标签颜色
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor, // Y 轴线颜色
        },
      },
      axisLabel: {
        color: textColor, // Y 轴标签颜色
      },
    },
    tooltip: {
      textStyle: {
        color: textColor, // 提示框文本颜色
      },
      backgroundColor: containerColor, // 提示框背景色
      borderColor: borderColor, // 提示框边框颜色
    },
  };
};
export const getChartColorOption = (colorList) => {
  if (!colorList || colorList.length === 0) {
    // 默认颜色配置
    return {
      color: ['#0052d9', '#78bdd5', '#ef84ce', '#57c2b8', '#ef9f79', '#4fc241', '#73a4e1', '#f59e78'],
      series: [
        {
          lineStyle: {
            color: '#5470C6',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(84, 112, 198, 0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(84, 112, 198, 0.1)',
                },
              ],
            },
          },
        },
        {
          lineStyle: {
            color: '#78bdd5',
          },
        },
      ],
    };
  }
  return {
    color: colorList,
    series: [
      {
        lineStyle: {
          color: colorList[0],
        },
        itemStyle: {
          color: colorList[0],
        },
      },
      {
        lineStyle: {
          color: colorList[1],
        },
        itemStyle: {
          color: colorList[1],
        },
      },
    ],
  };
};
export const getTrendingChartColorOption = (colorList) => {
  if (!colorList || colorList.length === 0) {
    // 默认颜色配置
    return {
      color: ['#0052d9', '#78bdd5', '#ef84ce', '#57c2b8', '#ef9f79', '#4fc241', '#73a4e1', '#f59e78'],
      series: [
        {
          lineStyle: {
            color: '#5470C6',
          },
        },
        {
          lineStyle: {
            color: '#78bdd5',
          },
        },
      ],
    };
  }

  return {
    color: colorList,
    series: [
      {
        lineStyle: {
          color: colorList[0],
        },
      },
      {
        lineStyle: {
          color: colorList[1],
        },
      },
      {
        lineStyle: {
          color: colorList[2],
        },
      },
      {
        lineStyle: {
          color: colorList[3],
        },
      },
    ],
  };
};
export const getShockChartColorOption = (colorList) => {
  if (!colorList || colorList.length === 0) {
    // 默认颜色配置
    return {
      color: ['#0052d9', '#78bdd5', '#ef84ce', '#57c2b8', '#ef9f79', '#4fc241', '#73a4e1', '#f59e78'],
      series: [
        {
          lineStyle: {
            color: '#5470C6',
          },
        },
        {
          lineStyle: {
            color: '#78bdd5',
          },
        },
      ],
    };
  }

  return {
    color: colorList,
    series: [
      {
        lineStyle: {
          color: colorList[0],
        },
      },
      {
        lineStyle: {
          color: colorList[1],
        },
      },
    ],
  };
};

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
export const getTrendingChartOptions = (data, name) => {
  let stockData;
  switch (name) {
    case 'MACD':
      stockData = calculateMACD(data.data);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: function (params) {
            let result = `<div style="font-weight:bold">${params[0].axisValue}</div>`;
            params.forEach((item) => {
              const color = item.color;
              let value = item.value;
              const seriesName = item.seriesName;

              if (seriesName === 'MACD') {
                // MACD值特殊处理，显示正负号
                value = Number(value).toFixed(2);
                value = value >= 0 ? '+' + value : value;
              } else {
                // DIF和DEA直接显示两位小数
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          data: data.data.map((item) => item.date),
          type: 'category',
          axisLabel: {
            interval: Math.floor(data.data.length / 4),
          },
        },
        yAxis: [
          {
            name: 'DIF/DEA',
            type: 'value',
            scale: true,
            splitLine: {
              show: true,
            },
          },
          {
            name: 'MACD',
            type: 'value',
            scale: true,
            splitLine: {
              show: false,
            },
          },
        ],
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
        series: [
          {
            name: 'DIF',
            type: 'line',
            data: stockData.DIF.map((v) => v.toFixed(2)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#0052d9',
            },
            symbol: 'none',
          },
          {
            name: 'DEA',
            type: 'line',
            data: stockData.DEA.map((v) => v.toFixed(2)),
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#78bdd5',
            },
            symbol: 'none',
          },
          {
            name: 'MACD',
            type: 'bar',
            yAxisIndex: 1,
            data: stockData.MACD.map((v) => v.toFixed(2)),
            itemStyle: {
              color: function (params) {
                // MACD柱状图颜色，正值为红色，负值为绿色
                return params.value >= 0 ? '#f6685d' : '#56c08d';
              },
            },
            barWidth: '60%',
          },
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(70),
            lineStyle: {
              color: '#f6685d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
        ],
      };
    case 'MA(5)':
      stockData = calculateMA(data.data, 5);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
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
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: 100,
          },
        ],
        xAxis: {
          type: 'category',
          data: data.data.map((item) => item.date), // 假设原始数据有date字段
        },
        yAxis: { type: 'value', scale: true },
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: data.data.map((item) => [item.open, item.close, item.low, item.high]), // 假设是K线图
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
            data: calculateMA(data.data, 5), // 计算5日均线
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 2,
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(data.data, 10), // 计算10日均线
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 2,
            },
          },
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(500),
            lineStyle: {
              color: '#f6685d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
        ],
      };
    case 'MA(20)':
      stockData = calculateMA(data.data, 20);
      console.log(stockData);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: function (params) {
            // 检查params是否存在且是数组
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
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: 100,
          },
        ],
        xAxis: {
          type: 'category',
          data: data.data.map((item) => item.date),
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: data.data.map((item) => [item.open, item.close, item.low, item.high]),
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
            data: calculateMA(data.data, 20), // 计算20日均线
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 2,
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(data.data, 10),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 2,
            },
          },
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(70),
            lineStyle: {
              color: '#f6685d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
        ],
      };
    case '布林带':
      stockData = calculateBollingerBands(data.data);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: function (params) {
            // 获取当前日期的数据
            const date = params[0].axisValue;
            let tooltipContent = `<div style="font-weight:bold;margin-bottom:5px;">${date}</div>`;

            // 遍历每个系列的数据
            params.forEach((item) => {
              const color = item.color;
              const seriesName = item.seriesName;
              let value = item.value;

              // 格式化数值，保留2位小数
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: data.data.map((item) => item.date), // 假设数据中有date字段
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: function (value) {
              return value.toFixed(2); // 保留2位小数
            },
          },
        },
        series: [
          {
            name: '收盘价',
            type: 'line',
            data: data.data.map((item) => item.close),
            lineStyle: {
              width: 2,
            },
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
};
export const getShockChartOptions = (data, name) => {
  let stockData;
  switch (name) {
    case 'RSI':
      stockData = calculateRSI(data.data);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          data: data.data.map((item) => item.date),
          type: 'category',
          axisLabel: {
            interval: Math.floor(data.data.length / 4),
          },
        },
        yAxis: {
          name: 'RSI',
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}',
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
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(70),
            lineStyle: {
              color: '#f6685d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(30),
            lineStyle: {
              color: '#56c08d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
        ],
      };
    case 'KDJ':
      stockData = calculateKDJ(data.data);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          data: data.data.map((item) => item.date),
          type: 'category',
          axisLabel: {
            interval: Math.floor(data.data.length / 4),
          },
        },
        yAxis: {
          name: 'KDJ',
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}',
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
    case 'CCI':
      stockData = calculateCCI(data.data);
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          data: data.data.map((item) => item.date),
          type: 'category',
          axisLabel: {
            interval: Math.floor(data.data.length / 4),
          },
        },
        yAxis: {
          name: 'CCI',
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}',
          },
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
          },
          {
            type: 'slider',
            xAxisIndex: 0,
          },
        ],
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
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(70),
            lineStyle: {
              color: '#f6685d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
          {
            name: '辅助线',
            type: 'line',
            data: Array(data.data.length).fill(30),
            lineStyle: {
              color: '#56c08d',
              type: 'dashed',
              width: 1,
            },
            symbol: 'none',
            silent: true,
          },
        ],
      };
  }
};
export const getInitialOptions = (stockData) => {
  return [
    getStockChartOptions(stockData, 'HKD'),
    getTrendingChartOptions(stockData, 'MA(5)'),
    getShockChartOptions(stockData, 'RSI'),
  ];
};
export const getOptions = (stockData, options) => {
  return [
    getStockChartOptions(stockData, 'HKD'),
    getTrendingChartOptions(stockData, options[0]),
    getShockChartOptions(stockData, options[1]),
  ];
};
