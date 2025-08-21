import { t } from '@/infrastructure/locales'
export const OPTIONS = {
  title: {
    text: t('pages.dashboard.chart.title'),
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: 'var(--td-text-color-primary)',
    },
  },
  series: [
    {
      name: t('pages.dashboard.chart.seriesName'),
      type: 'pie',
      radius: '60%',
      center: ['50%', '60%'],
      data: [
        { value: 3360, name: t('pages.dashboard.chart.indices.shanghai') },
        { value: 11900, name: t('pages.dashboard.chart.indices.shenzhen') },
        { value: 2480, name: t('pages.dashboard.chart.indices.gem') },
        { value: 1850, name: t('pages.dashboard.chart.indices.star50') },
        { value: 4200, name: t('pages.dashboard.chart.indices.csi300') },
      ],
      emphasis: {
        itemStyle: {
          shadowOffsetX: 0,
        },
      },
      label: {
        formatter: '{b}: {d}%',
        color: '#666',
        fontSize: 12,
      },
      labelLine: {
        lineStyle: {
          color: '#999',
        },
      },
    },
  ],
}

export const FEATURES = [
  {
    title: t('pages.dashboard.features.technicalAnalysis.title'),
    description: t('pages.dashboard.features.technicalAnalysis.description'),
    icon: 'chart',
    route: '/analysis/technical',
  },
  {
    title: t('pages.dashboard.features.strategyBacktest.title'),
    description: t('pages.dashboard.features.strategyBacktest.description'),
    icon: 'play-circle',
    route: '/backtest/template',
  },
  {
    title: t('pages.dashboard.features.marketData.title'),
    description: t('pages.dashboard.features.marketData.description'),
    icon: 'earth',
    route: '/market/stocks',
  },
]

export const STATISTICS = [
  {
    title: t('pages.dashboard.statistics.todayVolume.title'),
    value: 2.56,
    trend: t('pages.dashboard.statistics.trends.increase'),
    trendRatio: '12.5%',
    suffix: t('pages.dashboard.statistics.todayVolume.unit'),
    color: 'red',
  },
  {
    title: t('pages.dashboard.statistics.marketIndex.title'),
    value: 3568.23,
    trend: t('pages.dashboard.statistics.trends.decrease'),
    trendRatio: '2.3%',
    color: 'green',
  },
  {
    title: t('pages.dashboard.statistics.strategyReturn.title'),
    value: 8.7,
    trend: t('pages.dashboard.statistics.trends.increase'),
    trendRatio: '5.6%',
    suffix: t('pages.dashboard.statistics.strategyReturn.unit'),
    color: 'red',
  },
  {
    title: t('pages.dashboard.statistics.watchlist.title'),
    value: 32,
  },
]

export const NOTIFICATIONS = [
  {
    theme: 'success',
    title: t('pages.dashboard.notifications.welcome.title'),
    content: t('pages.dashboard.notifications.welcome.content'),
  },
  {
    theme: 'warning',
    title: t('pages.dashboard.notifications.strategyExecution.title'),
    content: t('pages.dashboard.notifications.strategyExecution.content'),
  },
  {
    theme: 'info',
    title: t('pages.dashboard.notifications.priceAlert.title'),
    content: t('pages.dashboard.notifications.priceAlert.content'),
  },
]
