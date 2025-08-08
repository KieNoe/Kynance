// apps/main-app/src/infrastructure/locales/lang/en_US/pages/backtest.ts
export default {
  title: 'Strategy Backtesting',
  buttons: {
    runBacktest: 'Run Backtest',
    running: 'Running...',
    settings: 'Parameters Settings',
  },
  dialog: {
    settingsTitle: 'Parameters Settings',
  },
  cards: {
    profitChart: 'Profit Curve',
    tradeRecords: 'Trade Records',
  },
  messages: {
    success: 'Backtesting completed!',
    tooFrequent: "Please don't click too frequently (；´д｀)ゞ",
  },
  table: {
    columns: {
      date: 'Trade Date',
      type: 'Trade Type',
      price: 'Price',
      quantity: 'Quantity',
      amount: 'Amount',
      profit: 'P&L',
      totalValue: 'Total Assets',
    },
  },
  backtestConfig: {
    title: 'Backtest Configuration',
    strategyName: 'Strategy Name',
    stockCode: 'Stock Code',
    backtestPeriod: 'Backtest Period',
    initialCapital: 'Initial Capital',
    commissionRate: 'Commission Rate',
    placeholders: {
      selectStrategy: 'Select Strategy',
      inputStockCode: 'e.g.: 000001',
      selectDateRange: 'Select Backtest Date Range',
    },
    strategies: {
      ma_cross: 'Moving Average Crossover',
      rsi_reversal: 'RSI Reversal',
      bollinger_bands: 'Bollinger Bands',
    },
    units: {
      yuan: '¥',
      percent: '%',
    },
  },
  resultCard: {
    title: 'Backtest Results',
    comment: "KieNoe's Comment:",
    easterEgg: {
      title: 'Easter Egg',
      content: 'As you can see, this is an easter egg',
    },
    metrics: {
      // Profit metrics
      totalReturn: {
        label: 'Total Return',
        tip: 'Total return percentage during the backtest period, negative value indicates loss',
      },
      annualReturn: {
        label: 'Annualized Return',
        tip: 'Annualized average return for easy comparison with other investments',
      },
      // Risk metrics
      maxDrawdown: {
        label: 'Max Drawdown',
        tip: 'Maximum loss from peak to trough, reflects risk control capability',
      },
      sharpeRatio: {
        label: 'Sharpe Ratio',
        tip: 'Risk-adjusted return measure, negative value indicates return below risk-free rate',
      },
      volatility: {
        label: 'Volatility',
        tip: 'Annualized standard deviation of returns, extremely high values indicate unstable returns',
      },
      Beta: {
        label: 'Beta',
        tip: 'Strategy volatility relative to market, 1 means same volatility as market',
      },
      // Trade statistics
      totalTrades: {
        label: 'Total Trades',
        tip: 'Total number of trades during backtest',
      },
      winRate: {
        label: 'Win Rate',
        tip: 'Percentage of profitable trades, low rates require analysis with profit/loss ratio',
      },
      avgWin: {
        label: 'Avg Profit',
        tip: 'Average return of winning trades',
      },
      avgLoss: {
        label: 'Avg Loss',
        tip: 'Average loss of losing trades',
      },
      // Other analysis metrics
      positionPeriod: {
        label: 'Holding Period',
        tip: 'Average holding days, reflects strategy type (e.g. 1 day for day trading)',
        suffix: 'days',
      },
      positionUtilizationRate: {
        label: 'Position Utilization',
        tip: 'Capital usage efficiency, abnormal negative values may indicate frequent shorting',
      },
      correlationAnalysis: {
        label: 'Correlation Analysis',
        tip: 'Correlation coefficient between strategy returns and market returns',
      },
      sectorDistribution: {
        label: 'Sector Distribution',
        tip: 'Concentration of strategy returns across sectors',
        formatter: {
          high: 'High dependency',
          medium: 'Medium dependency',
        },
      },
    },
    emptyState: 'Please configure parameters and run backtest',
    loading: 'Calculating backtest results...',
    performanceLevels: {
      veryBad: {
        one: 'Are you donating money to the market? Might as well call it "Charity Trading" 😅',
        second: 'Losing this much? Better put your money in a bank for a free thermos 🫤',
        third: 'Even worse than some Wuhan University master thesis data 🤔',
      },
      bad: {
        one: 'Next step is "The wind is strong on the rooftop" 🤔',
        second: 'As long as you don\'t sell, it\'s "value investing"( ´･･)ﾉ(._.`)',
        third: 'We found a little investment in a sea of risk ☹️',
      },
      neutral: {
        one: "Skip two hotpot meals and you'll break even, keep going ヾ(•ω•`)o",
        second: 'Just making friends with the stock market ヾ(•ω•`)o',
        third: "Small donations accumulate virtue, that's you φ(゜▽゜*)♪",
      },
      good: {
        one: "Could've earned two spicy hotpot meals with Yu'E Bao (not bad) 🙂",
        second: "Average performance, aka 'Market Atmosphere Group' 😶‍🌫️",
        third: "No beach villa yet, but at least you're free to choose bathroom tiles 🪟",
      },
      veryGood: {
        one: "Can compete with Yu'E Bao now 😎",
        second: 'At least enough for coffee (except Starbucks) 😊',
        third: 'Congratulations! You beat 60% of retail investors! φ(゜▽゜*)♪',
      },
      excellent: {
        one: 'This time, the market paid you 50 bucks 💰',
        second: 'A piece of cake 😎',
        third: "Congratulations! You're among the top 10% investors 😎",
      },
      unbelievable: {
        one: 'Seriously dude, is this real? (；´д｀)ゞ',
        second: 'Rich bro, show me your power with 50 bucks (´▽`ʃ♡ƪ)',
        third: 'Who stole my life 😣',
      },
      legendary: {
        one: 'What? What!',
      },
    },
    easterEggHint: 'What?',
  },
  setting: {
    title: 'Strategy Parameters Settings',
    currentParameters: 'Current Parameters',
    buttons: {
      save: 'Save Current Parameters',
      load: 'Load Saved Parameters',
    },
    dialog: {
      save: {
        title: 'Save Strategy Parameters',
        confirm: 'Save',
        cancel: 'Cancel',
        nameLabel: 'Strategy Name',
        namePlaceholder: 'Enter strategy name',
        nameError:
          'Strategy name can only contain letters, numbers or Chinese characters, max 7 chars',
      },
      load: {
        title: 'Load Strategy Parameters',
        confirm: 'Load',
        cancel: 'Cancel',
        noSelection: 'Please select a strategy',
      },
    },
    table: {
      columns: {
        name: 'Strategy Name',
        time: 'Created Time',
        strategy: 'Strategy Type',
        actions: 'Actions',
      },
      actions: {
        delete: 'Delete',
        deleteConfirm: 'Confirm deletion?',
      },
    },
    messages: {
      saveSuccess: 'Strategy parameters saved successfully',
      loadSuccess: 'Strategy parameters loaded successfully',
      deleteSuccess: 'Deleted successfully',
      emptyName: 'Please enter strategy name',
    },
    parameters: {
      // Backtest configuration parameters
      strategy: 'Strategy Type',
      symbol: 'Stock Code',
      initialCapital: 'Initial Capital',
      commission: 'Commission Rate',
      holdingPeriod: 'Holding Period',
      startDate: 'Start Date',
      endDate: 'End Date',

      // Common strategy parameters
      shareHoldingLimit: 'Share Holding Limit',
      profitHoldThreshold: 'Profit Hold Threshold',
      trailingStopPercent: 'Trailing Stop',
      stopLossLimit: 'Stop Loss Limit',

      // MA Crossover strategy parameters
      shortPeriod: 'Short MA Period',
      longPeriod: 'Long MA Period',

      // RSI strategy parameters
      rsiPeriod: 'RSI Period',
      overbought: 'Overbought Level',
      oversold: 'Oversold Level',

      // Bollinger Bands strategy parameters
      bollingerBandsPeriod: 'Bollinger Bands Period',
      standardDeviationMultiple: 'Std Dev Multiple',
    },
    strategyTypes: {
      ma_cross: 'MA Crossover',
      rsi_reversal: 'RSI Reversal',
      bollinger_bands: 'Bollinger Bands',
    },
    units: {
      shares: 'shares',
      percent: '%',
    },
  },
  strategyParams: {
    title: 'Strategy Parameters',
    common: {
      shareHoldingLimit: {
        label: 'Share Holding Limit',
        tip: 'Maximum number of stocks to hold',
        suffix: 'shares',
      },
      profitHoldThreshold: {
        label: 'Profit Hold Threshold',
        tip: 'Continue holding when reaching this profit percentage',
        suffix: '%',
      },
      trailingStopPercent: {
        label: 'Trailing Stop',
        tip: 'Sell when falling this percentage from peak',
        suffix: '%',
      },
      stopLossLimit: {
        label: 'Stop Loss Limit',
        tip: 'Force sell when loss reaches this percentage',
        suffix: '%',
      },
    },
    maCross: {
      shortPeriod: {
        label: 'Short MA Period',
        tip: 'Short moving average period',
      },
      longPeriod: {
        label: 'Long MA Period',
        tip: 'Long moving average period',
      },
    },
    rsiReversal: {
      rsiPeriod: {
        label: 'RSI Period',
        tip: 'Relative Strength Index calculation period',
      },
      overbought: {
        label: 'Overbought Level',
        tip: 'RSI above this value is considered overbought',
      },
      oversold: {
        label: 'Oversold Level',
        tip: 'RSI below this value is considered oversold',
      },
    },
    bollingerBands: {
      bollingerBandsPeriod: {
        label: 'Bollinger Bands Period',
        tip: 'Bollinger Bands calculation period',
      },
      standardDeviationMultiple: {
        label: 'Std Dev Multiple',
        tip: 'Standard deviation multiple for band width',
      },
    },
  },
}
