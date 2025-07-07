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
  return {
    color: colorList,
  };
};
export const getLineChartOption = (option) => {
  return {
    ...option,
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '',
        type: 'line',
        data: [],
        smooth: true,
      },
    ],
  };
};
export const getBarChartOption = (option) => {
  return {
    ...option,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: [],
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '',
        type: 'bar',
        data: [],
      },
    ],
  };
};
export const getPieChartOption = (option) => {
  return {
    ...option,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [],
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [],
      },
    ],
  };
};
export const getScatterChartOption = (option) => {
  return {
    ...option,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '',
        type: 'scatter',
        symbolSize: 10,
        data: [],
      },
    ],
  };
};
export const getRadarChartOption = (option) => {
  return {
    ...option,
    tooltip: {
      trigger: 'item',
    },
    legend: {
      data: [],
    },
    radar: {
      indicator: [],
    },
    series: [
      {
        name: '',
        type: 'radar',
        data: [],
      },
    ],
  };
};
