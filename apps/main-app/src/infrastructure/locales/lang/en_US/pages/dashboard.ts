export default {
  welcome: 'Welcome back,',
  today: 'Today is',
  wish: ', wish you successful trading!',
  market: 'Market Overview',
  year: 'Year',
  month: 'Month',
  day: 'Day',
  chart: {
    title: 'Market Index Distribution',
    seriesName: 'Index Proportion',
    indices: {
      shanghai: 'SSE Composite Index',
      shenzhen: 'SZSE Component Index',
      gem: 'ChiNext Index',
      star50: 'STAR 50 Index',
      csi300: 'CSI 300 Index',
    },
  },
  features: {
    technicalAnalysis: {
      title: 'Technical Analysis',
      description: 'Professional technical indicators and chart analysis tools',
    },
    strategyBacktest: {
      title: 'Strategy Backtesting',
      description: 'Backtest your trading strategies and optimize performance',
    },
    marketData: {
      title: 'Market Data',
      description: 'Real-time market data and stock information',
    },
  },
  statistics: {
    todayVolume: {
      title: "Today's Trading Volume",
      unit: 'Billion',
    },
    marketIndex: {
      title: 'Market Index',
    },
    strategyReturn: {
      title: 'Strategy Return',
      unit: '%',
    },
    watchlist: {
      title: 'Watchlist',
    },
    trends: {
      increase: 'Increase',
      decrease: 'Decrease',
    },
  },
  notifications: {
    welcome: {
      theme: 'success',
      title: 'Welcome to Kynance Quantitative Trading Platform',
      content: 'Your account has been activated! Start your quantitative investment journey now.',
    },
    strategyExecution: {
      theme: 'warning',
      title: 'Momentum Strategy Executed',
      content:
        'Your strategy was triggered today at 15:00, successfully bought 200 shares of AAPL at average price of $182.56',
    },
    priceAlert: {
      theme: 'info',
      title: 'TSLA Price Fluctuation Alert',
      content:
        'Tesla (TSLA) in your watchlist has dropped -7.2%, breaking through the Bollinger Band lower rail with trading volume 3 times the average',
    },
  },
}
