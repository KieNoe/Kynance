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
      ],
    };
  }

  function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return {
    color: colorList,
    series: [
      {
        lineStyle: {
          color: colorList[0],
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
                color: hexToRgba(colorList[0], 0.5),
              },
              {
                offset: 1,
                color: hexToRgba(colorList[0], 0.1),
              },
            ],
          },
        },
      },
    ],
  };
};
function formatNumberToWan(num) {
  if (num >= 10000) {
    const intPart = Math.floor(num).toLocaleString('en-US');
    return num % 10000 === 0 ? `${(num / 10000).toLocaleString('en-US')}万` : `${intPart}万`;
  } else {
    return num.toLocaleString('en-US');
  }
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
        const data = params[0].data;
        return `
        <div><strong>${currency} $${data.close}</strong></div>
        <div>${params[0].axisValueLabel}</div>
        <div>成交量：${formatNumberToWan(data.volume)}</div>
      `;
      },
    },
    yAxis: {
      scale: true,
      axisLabel: {
        formatter: '{value}',
      },
    },
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
              },
              {
                offset: 1,
              },
            ],
          },
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
export const getTrendingChartOptions = () => {};
export const getShockChartOptions = () => {};
export const getVolumeChartOptions = () => {};
