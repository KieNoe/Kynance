self.addEventListener('message', async (e) => {
  try {
    // 检查消息格式是否正确
    if (!e.data) {
      throw new Error('消息格式无效：应包含 { code: string }')
    }

    // 验证策略代码并返回结果
    const validationResult = await validateStrategyCode(e.data)
    self.postMessage(validationResult)
  } catch (error) {
    // 即使出错也返回结构化错误信息
    self.postMessage({
      isValid: false,
      errors: [`Worker内部错误: ${error.message}`],
      warnings: [],
    })
  }
})

// 验证相关常量配置
const VALIDATION_CONSTANTS = {
  TIMEOUT_MS: 1000, // 执行超时时间(毫秒)
  FORBIDDEN_APIS: [
    // 禁止使用的API列表
    'eval',
    'Function',
    'setTimeout',
    'setInterval',
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    'import',
    'require',
    'process',
    'fs',
    'child_process',
    'exec',
    'spawn',
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'Worker',
    'importScripts',
  ],
  REQUIRED_OUTPUT_PROPS: [
    // 必须包含的输出属性
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
    'Beta',
    'positionUtilizationRate',
    'correlationAnalysis',
    'sectorDistribution',
  ],
  TRADE_PROPS: [
    // 交易记录建议包含的属性
    'id',
    'date',
    'type',
    'price',
    'quantity',
    'amount',
    'profit',
    'totalValue',
  ],
}

/**
 * 验证交易策略代码的安全性和正确性
 * @param {string} code - 要验证的JavaScript代码
 * @returns {Promise<Object>} 验证结果 { isValid, errors[], warnings[] }
 */
async function validateStrategyCode(code) {
  const result = {
    isValid: true, // 是否有效
    errors: [], // 错误信息
    warnings: [], // 警告信息
  }

  // 1. 基本语法验证
  const runStrategy = validateSyntax(code, result)
  if (!result.isValid) return result

  // 2. 函数签名验证
  validateFunctionSignature(runStrategy, result)
  if (!result.isValid) return result

  // 3. 使用模拟数据进行测试执行
  await testExecution(runStrategy, result)
  if (!result.isValid) return result

  // 4. 安全检查
  performSecurityChecks(code, result)

  // 5. 代码质量检查
  checkCodeQuality(code, result)

  return result
}

/**
 * 验证代码语法并提取runStrategy函数
 */
function validateSyntax(code, result) {
  if(code){
    const parseCode = new Function(`
      ${code}
      return runStrategy;  // 返回目标函数
    `);

    // 3. 获取函数
    const runStrategy = parseCode();
    return runStrategy
  } else {
    result.isValid = false
    result.errors.push('代码不能包含任何非字符串内容')
    return
  }
}

/**
 * 验证runStrategy函数签名
 */
function validateFunctionSignature(runStrategy, result) {
  if (typeof runStrategy !== 'function') {
    result.isValid = false
    result.errors.push('代码必须包含名为runStrategy的函数')
    return
  }

  // 检查参数数量是否为3个
  if (runStrategy.length !== 3) {
    result.isValid = false
    result.errors.push(
      'runStrategy函数必须接受3个参数: backtestConfig, strategyParams, stocksData',
    )
  }
}

/**
 * 使用模拟数据测试执行并验证输出
 */
async function testExecution(runStrategy, result) {
  try {
    const testInput = generateMockInput()
    const output = await executeWithTimeout(
      () =>
        runStrategy(testInput.backtestConfig, testInput.strategyParams, testInput.stocksData),
      VALIDATION_CONSTANTS.TIMEOUT_MS,
    )
    validateOutputStructure(output, result)
  } catch (e) {
    result.isValid = false
    result.errors.push(
      e.message.includes('Timeout')
        ? `执行超时 (${VALIDATION_CONSTANTS.TIMEOUT_MS}毫秒)`
        : `执行错误: ${e.message}`,
    )
  }
}

/**
 * 生成用于测试的模拟输入数据
 */
function generateMockInput() {
  return {
    backtestConfig: {
      // 回测配置
      strategy: 'ma_cross', // 策略名称
      symbol: '000001.SH', // 标的代码
      dateRange: ['2020-01-01', '2020-12-31'], // 日期范围
      initialCapital: 100000, // 初始资金
      commission: 0.0003, // 佣金比例
    },
    strategyParams: {
      // 策略参数
      holdingPeriod: 5, // 持有周期
      shareHoldingLimit: 1000, // 持股限制
      profitHoldThreshold: 0.1, // 止盈阈值
      trailingStopPercent: 0.05, // 移动止损百分比
      stopLossLimit: 0.03, // 止损限制
      shortPeriod: 5, // 短期均线周期
      longPeriod: 20, // 长期均线周期
    },
    stocksData: Array(30)
      .fill(0)
      .map((_, i) => ({
        date: `2020-01-${String(i + 1).padStart(2, '0')}`, // 格式化日期
        open: 100 + Math.random() * 10, // 开盘价
        high: 105 + Math.random() * 10, // 最高价
        low: 95 + Math.random() * 5, // 最低价
        close: 100 + Math.random() * 8, // 收盘价
        volume: 100000 + Math.random() * 50000, // 成交量
        change: (Math.random() - 0.5) * 5, // 价格变化
        changePercent: (Math.random() - 0.5) * 3, // 变化百分比
        marketState: 'NORMAL', // 市场状态
        bid: 99 + Math.random() * 5, // 买价
        ask: 101 + Math.random() * 5, // 卖价
        bidSize: 1000 + Math.random() * 500, // 买量
        askSize: 1000 + Math.random() * 500, // 卖量
        spread: 0.1 + Math.random() * 0.5, // 价差
      })),
  }
}

/**
 * 验证策略输出结构是否符合要求
 */
function validateOutputStructure(output, result) {
  // 检查是否返回了对象
  if (typeof output !== 'object' || output === null) {
    result.isValid = false
    result.errors.push('函数必须返回一个对象')
    return
  }

  // 检查必须包含的输出属性
  VALIDATION_CONSTANTS.REQUIRED_OUTPUT_PROPS.forEach((prop) => {
    if (!(prop in output)) {
      result.isValid = false
      result.errors.push(`返回对象缺少必要属性: ${prop}`)
    }
  })

  // 验证交易记录数组结构
  if (Array.isArray(output.trades) && output.trades.length > 0) {
    const sampleTrade = output.trades[0]
    VALIDATION_CONSTANTS.TRADE_PROPS.forEach((prop) => {
      if (!(prop in sampleTrade)) {
        result.warnings.push(`交易记录缺少建议属性: ${prop}`)
      }
    })
  }

  // 验证资金曲线结构
  if (Array.isArray(output.equityCurve) && output.equityCurve.length > 0) {
    const samplePoint = output.equityCurve[0]
    if (!('date' in samplePoint) || !('value' in samplePoint)) {
      result.warnings.push('资金曲线数组元素应包含date和value属性')
    }
  }
}

/**
 * 执行安全检查
 */
function performSecurityChecks(code, result) {
  // 检查是否使用了禁止的API
  VALIDATION_CONSTANTS.FORBIDDEN_APIS.forEach((api) => {
    if (new RegExp(`\\b${api}\\b`).test(code)) {
      result.isValid = false
      result.errors.push(`检测到禁止使用的API: ${api}`)
    }
  })

  // 检查是否修改了输入参数
  if (/(backtestConfig|strategyParams|stocksData)\s*[=.]/.test(code)) {
    result.warnings.push('输入参数应视为只读，不建议直接修改')
  }
}

/**
 * 执行代码质量检查
 */
function checkCodeQuality(code, result) {
  // 检查可能的无限循环模式
  const loopPatterns = [
    /while\s*?\s*true\s*?\s*\{/, // while(true)
    /for\s*$$[^;]*;\s*;\s*[^)]*$$\s*\{/, // for(;;)
    /for\s*$$.*;.*;\s*$$\s*\{\s*\}/, // 空for循环体
  ]

  loopPatterns.some((pattern) => {
    if (pattern.test(code)) {
      result.warnings.push('检测到可能的无限循环模式')
      return true
    }
    return false
  })

  // 检查是否有异常处理
  if (!/(try\s*\{|catch\s*\()/.test(code)) {
    result.warnings.push('建议添加异常处理逻辑(try/catch)')
  }

  // 检查是否有调试语句
  if (/console\.(log|warn|error|info|debug)/.test(code)) {
    result.warnings.push('生产环境中建议移除调试用的console语句')
  }
}

/**
 * 带超时限制的执行函数
 */
function executeWithTimeout(func, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`执行超时 (${timeoutMs}毫秒)`))
    }, timeoutMs)

    try {
      // 支持异步函数
      Promise.resolve(func())
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeout))
    } catch (e) {
      clearTimeout(timeout)
      reject(e)
    }
  })
}
