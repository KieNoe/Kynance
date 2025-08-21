export default {
  welcome: '欢迎回来，',
  today: '今天是',
  wish: '，祝您交易顺利！',
  market: '市场概览',
  year: '年',
  month: '月',
  day: '日',
  chart: {
    title: '市场指数分布',
    seriesName: '指数占比',
    indices: {
      shanghai: '上证指数',
      shenzhen: '深证成指',
      gem: '创业板指',
      star50: '科创50',
      csi300: '沪深300',
    },
  },
  features: {
    technicalAnalysis: {
      title: '技术分析',
      description: '专业的技术指标和图表分析工具',
    },
    strategyBacktest: {
      title: '策略回测',
      description: '回测您的交易策略并优化表现',
    },
    marketData: {
      title: '市场行情',
      description: '实时市场数据和股票信息',
    },
  },
  statistics: {
    todayVolume: {
      title: '今日交易量',
      unit: '亿',
    },
    marketIndex: {
      title: '市场指数',
    },
    strategyReturn: {
      title: '策略收益',
      unit: '%',
    },
    watchlist: {
      title: '关注股票',
    },
    trends: {
      increase: '增长',
      decrease: '下降',
    },
  },
  notifications: {
    welcome: {
      theme: 'success',
      title: '欢迎加入 Kynance 量化交易平台',
      content: '您的账户已激活！立即开启您的量化投资之旅。',
    },
    strategyExecution: {
      theme: 'warning',
      title: '动量策略执行完成',
      content: '您的策略于今日15:00触发，成功买入AAPL 200股，成交均价182.56美元',
    },
    priceAlert: {
      theme: 'info',
      title: 'TSLA股价波动异常',
      content: '您关注的特斯拉(TSLA)当前跌幅-7.2%，已突破布林带下轨，成交量放大至平日3倍',
    },
  },
}
