// worker.js - Web Worker 实现

// 监听主线程消息
self.onmessage = function (e) {
  const { code, backtestConfig, strategyParams, stocksData } = e.data;

  try {
    // 验证输入参数
    validateInputs(backtestConfig, strategyParams, stocksData);

    // 在隔离环境中执行用户代码
    const userFunction = validateAndParseCode(code);

    // 执行回测
    const result = executeBacktest(userFunction, backtestConfig, strategyParams, stocksData);

    // 验证结果结构
    validateResultStructure(result);

    // 返回成功结果
    self.postMessage({
      success: true,
      result: result,
      warnings: [], // 可以添加任何非致命的警告
    });
  } catch (error) {
    // 返回错误信息
    self.postMessage({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
};

// 验证输入参数
function validateInputs(backtestConfig, strategyParams, stocksData) {
  if (!backtestConfig || typeof backtestConfig !== 'object') {
    throw new Error('backtestConfig 必须是对象');
  }

  // 检查必填字段
  const requiredBacktestFields = ['strategy', 'symbol', 'dateRange', 'initialCapital', 'commission'];
  for (const field of requiredBacktestFields) {
    if (!(field in backtestConfig)) {
      throw new Error(`backtestConfig 缺少必填字段: ${field}`);
    }
  }

  // 检查策略参数
  if (!strategyParams || typeof strategyParams !== 'object') {
    throw new Error('strategyParams 必须是对象');
  }

  // 检查股票数据
  if (!Array.isArray(stocksData) || stocksData.length === 0) {
    throw new Error('stocksData 必须是非空数组');
  }

  // 检查股票数据字段
  const requiredStockFields = ['date', 'open', 'high', 'low', 'close', 'volume'];
  const firstStock = stocksData[0];
  for (const field of requiredStockFields) {
    if (!(field in firstStock)) {
      throw new Error(`stocksData 中的股票数据缺少必填字段: ${field}`);
    }
  }
}

// 验证和解析用户代码
function validateAndParseCode(code) {
  // 基本安全检查 - 防止直接访问全局对象
  const forbiddenPatterns = [
    /\.?globalThis\b/,
    /\.?window\b/,
    /\.?document\b/,
    /\.?parent\b/,
    /\.?top\b/,
    /\.?self\b/,
    /\.?import\s*\(/,
    /\.?eval\s*\(/,
    /\.?Function\s*\(/,
    /\.?setTimeout\s*\(/,
    /\.?setInterval\s*\(/,
    /\.?fetch\s*\(/,
    /\.?XMLHttpRequest\b/,
    /\.?process\b/,
    /\.?require\s*\(/,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(code)) {
      throw new Error('代码包含不允许的操作: ' + pattern.toString());
    }
  }

  try {
    // 在严格模式下执行代码
    const wrappedCode = `"use strict";\n${code}\n//# sourceURL=userStrategy.js`;
    const func = new Function('backtestConfig', 'strategyParams', 'stocksData', wrappedCode);
    return func;
  } catch (e) {
    throw new Error(`代码解析错误: ${e.message}`);
  }
}

// 执行回测并验证结果
function executeBacktest(userFunction, backtestConfig, strategyParams, stocksData) {
  let result;

  try {
    result = userFunction(backtestConfig, strategyParams, stocksData);
  } catch (e) {
    throw new Error(`执行回测时出错: ${e.message}`);
  }

  return result;
}

// 验证结果结构
function validateResultStructure(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('回测结果必须是一个对象');
  }

  // 检查必填结果字段
  const requiredResultFields = [
    'totalReturn',
    'annualReturn',
    'maxDrawdown',
    'sharpeRatio',
    'totalTrades',
    'winRate',
    'avgWin',
    'avgLoss',
    'trades',
    'equityCurve',
    'positionPeriod',
    'volatility',
  ];

  for (const field of requiredResultFields) {
    if (!(field in result)) {
      throw new Error(`回测结果缺少必填字段: ${field}`);
    }
  }

  // 检查交易记录数组
  if (!Array.isArray(result.trades)) {
    throw new Error('trades 必须是数组');
  }

  // 检查资产曲线数组
  if (!Array.isArray(result.equityCurve)) {
    throw new Error('equityCurve 必须是数组');
  }

  // 检查交易记录结构
  if (result.trades.length > 0) {
    const requiredTradeFields = ['id', 'date', 'type', 'price', 'quantity', 'amount'];
    const firstTrade = result.trades[0];

    for (const field of requiredTradeFields) {
      if (!(field in firstTrade)) {
        throw new Error(`交易记录缺少必填字段: ${field}`);
      }
    }
  }

  // 检查资产曲线结构
  if (result.equityCurve.length > 0) {
    const requiredEquityFields = ['date', 'value'];
    const firstEquity = result.equityCurve[0];

    for (const field of requiredEquityFields) {
      if (!(field in firstEquity)) {
        throw new Error(`资产曲线缺少必填字段: ${field}`);
      }
    }
  }
}
