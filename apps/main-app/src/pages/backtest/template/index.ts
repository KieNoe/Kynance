import { t } from '@/infrastructure/locales'
export const getOption = (sortedData) => {
  return {
    xAxis: {
      data: sortedData.map((item) => item.date),
      type: 'category',
      axisLabel: {
        interval: Math.floor(sortedData.length / 4),
        color: '#666',
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#333',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12,
      },
      formatter: function (params) {
        const data = params[0]
        return `
        <div style="font-weight:bold;margin-bottom:5px;">${data.axisValue}</div>
        <div style="display:flex;justify-content:space-between;">
          <span style="margin-right:20px;">盈利金额:</span>
          <span style="font-weight:bold;color:${data.data >= 0 ? '#e34d59' : '#00a870'}">${data.data} 元</span>
        </div>
      `
      },
    },
    yAxis: {
      name: '盈亏（人民币）',
      nameTextStyle: {
        color: '#666',
        padding: [0, 0, 0, 40],
      },
      axisLabel: {
        formatter: '{value}',
        color: '#666',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
      scale: true,
    },
    series: [
      {
        data: sortedData.map((item) => item.profit),
        type: 'bar',
        itemStyle: {
          color: function (params) {
            // 根据数值正负设置不同颜色
            return params.value >= 0 ? '#e34d59' : '#00a870'
          },
          borderRadius: [4, 4, 0, 0], // 顶部圆角
        },
        barWidth: '60%', // 柱子的宽度
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        animationDuration: 2000,
        animationEasing: 'elasticOut',
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
  }
}
export const tradeColumns = [
  {
    colKey: 'date',
    title: t('pages.backtest.table.columns.date'),
    width: 120,
  },
  {
    colKey: 'type',
    title: t('pages.backtest.table.columns.type'),
    width: 80,
  },
  {
    colKey: 'price',
    title: t('pages.backtest.table.columns.price'),
    width: 100,
  },
  {
    colKey: 'quantity',
    title: t('pages.backtest.table.columns.quantity'),
    width: 100,
  },
  {
    colKey: 'amount',
    title: t('pages.backtest.table.columns.amount'),
    width: 120,
  },
  {
    colKey: 'profit',
    title: t('pages.backtest.table.columns.profit'),
    width: 100,
  },
  {
    colKey: 'totalValue',
    title: t('pages.backtest.table.columns.totalValue'),
    width: 120,
  },
]
