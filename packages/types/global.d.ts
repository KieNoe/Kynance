export declare type Recordable<T = any> = Record<string, T>;
export interface StoreConfig {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
  indexes?: Array<{
    name: string;
    keyPath: string;
    unique?: boolean;
  }>;
}
export interface PageQuery {
  /** 页码，从1开始 */
  page: number;
  /** 每页记录数 */
  pageSize: number;
}
export interface BacktestRecord {
  id?: number; // 可选，由数据库自动生成
  date: string; // 回测日期时间
  isCustomCode: boolean; // 是否自定义代码
  backtestConfig: {
    strategy: string; // 策略名称
    symbol: string; // 股票代码
    dateRange: [string, string]; // 回测日期范围
    initialCapital: number; // 初始资金
    commission: number; // 手续费率
  };
  strategyParams: {
    holdingPeriod?: number; // 持仓周期
    shareHoldingLimit?: number; // 持股限制
    profitHoldThreshold?: number; // 利润持有阈值
    trailingStopPercent?: number; // 追踪止损百分比
    stopLossLimit?: number; // 止损限制
    // 均线交叉策略参数
    shortPeriod?: number;
    longPeriod?: number;
    // RSI策略参数
    rsiPeriod?: number;
    overbought?: number;
    oversold?: number;
    // 布林带策略参数
    bollingerBandsPeriod?: number;
    standardDeviationMultiple?: number;
  };
  stockData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
    marketState: string;
    bid: number;
    ask: number;
    bidSize: number;
    askSize: number;
    spread: number;
  }>;
  backtestResult: {
    totalReturn: number;
    annualReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    trades: Array<{
      id: number;
      date: string;
      type: string;
      price: string;
      quantity: number;
      amount: string;
      profit: string;
      totalValue: string;
    }>;
    equityCurve: Array<{
      date: string;
      value: number;
    }>;
    positionPeriod: number;
    volatility: number;
    Beta: number;
    positionUtilizationRate: number;
    correlationAnalysis: number;
    sectorDistribution: number;
  };
}
