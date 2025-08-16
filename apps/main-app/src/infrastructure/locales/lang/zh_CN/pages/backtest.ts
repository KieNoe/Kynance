// apps/main-app/src/infrastructure/locales/lang/zh_CN/pages/backtest.ts
export default {
  template: {
    title: '策略回测',
    buttons: {
      runBacktest: '开始回测',
      running: '回测中...',
      settings: '参数设置',
    },
    dialog: {
      settingsTitle: '参数设置',
    },
    cards: {
      profitChart: '收益曲线',
      tradeRecords: '交易记录',
    },
    messages: {
      success: '回测计算完成！',
      tooFrequent: '请勿频繁点击（；´д｀）ゞ',
    },
    table: {
      columns: {
        date: '交易日期',
        type: '交易类型',
        price: '成交价格',
        quantity: '交易数量',
        amount: '交易金额',
        profit: '盈亏',
        totalValue: '总资产',
      },
    },
    backtestConfig: {
      title: '回测配置',
      strategyName: '策略名称',
      stockCode: '股票代码',
      backtestPeriod: '回测周期',
      initialCapital: '初始资金',
      commissionRate: '手续费率',
      placeholders: {
        selectStrategy: '请选择策略',
        inputStockCode: '如：000001',
        selectDateRange: '选择回测时间范围',
      },
      strategies: {
        ma_cross: '均线交叉策略',
        rsi_reversal: 'RSI反转策略',
        bollinger_bands: '布林带策略',
      },
      units: {
        yuan: '元',
        percent: '%',
      },
    },
    resultCard: {
      title: '回测结果',
      comment: 'KieNoe评语：',
      easterEgg: {
        title: '彩蛋',
        content: '如你所见，这是一个彩蛋',
      },
      metrics: {
        // 收益指标
        totalReturn: {
          label: '总收益率',
          tip: '整个回测期间的总收益百分比，负值表示亏损',
        },
        annualReturn: {
          label: '年化收益率',
          tip: '将总收益率折算为年度平均收益率，便于与其他投资比较',
        },
        // 风险指标
        maxDrawdown: {
          label: '最大回撤',
          tip: '从最高点到最低点的最大亏损幅度，反映策略的风险控制能力',
        },
        sharpeRatio: {
          label: '夏普比率',
          tip: '衡量风险调整后的收益，负值表示收益低于无风险利率（如国债），波动过大',
        },
        volatility: {
          label: '波动率',
          tip: '收益率的年化标准差，数值极高表明策略收益极不稳定（可能因高频交易或杠杆）',
        },
        Beta: {
          label: 'Beta值',
          tip: '策略相对于大盘的波动性，1表示与市场波动一致，小于1表示波动小于市场',
        },
        // 交易统计
        totalTrades: {
          label: '交易次数',
          tip: '回测期间的总交易笔数',
        },
        winRate: {
          label: '胜率',
          tip: '盈利交易占总交易次数的比例，较低胜率需结合盈亏比分析策略有效性',
        },
        avgWin: {
          label: '平均盈利',
          tip: '盈利交易的平均收益率，需与平均亏损比较评估风险收益比',
        },
        avgLoss: {
          label: '平均亏损',
          tip: '亏损交易的平均亏损率，远高于平均盈利时表明止损或选股可能存在问题',
        },
        // 其他分析指标
        positionPeriod: {
          label: '持仓周期',
          tip: '平均持仓天数，反映策略类型（如日内交易为1天，长线投资则数值较大）',
          suffix: '天',
        },
        positionUtilizationRate: {
          label: '仓位利用率',
          tip: '资金使用效率，异常负值可能表示频繁做空或杠杆操作，需检查计算逻辑',
        },
        correlationAnalysis: {
          label: '相关性分析',
          tip: '策略收益与大盘收益的相关系数，接近1表示高度依赖市场行情，缺乏独立性',
        },
        sectorDistribution: {
          label: '板块分布',
          tip: '策略收益在行业板块的集中程度，分散性不足时易受特定板块波动影响',
          formatter: {
            high: '高度依赖',
            medium: '中度依赖',
          },
        },
      },
      emptyState: '请配置参数并开始回测',
      loading: '正在进行回测计算...',
      performanceLevels: {
        veryBad: {
          one: '这是专门给对手盘送钱吗？建议改名叫《慈善交易法》😅',
          second: '亏成这样，不如把钱存银行，至少还能得个保温杯🫤',
          third: '比武汉大学优秀硕士论文的数据都离谱🤔',
        },
        bad: {
          one: '下一步就是"天台的风好大"了🤔',
          second: '只要不卖，就是"价值投资"( ´･･)ﾉ(._.`)',
          third: '我们在大量的风险里找到了少量的投资☹️',
        },
        neutral: {
          one: '少吃两顿火锅就能回本，请继续加油ヾ(•ω•`)o',
          second: '就当给股市交个朋友ヾ(•ω•`)o',
          third: '小额捐款，积德行善，是你没错了φ(゜▽゜*)♪',
        },
        good: {
          one: '放余额宝里能多赚两顿麻辣烫（好像也挺好）🙂',
          second: "中规中矩，俗称'股市气氛组'😶‍🌫️",
          third: '虽然没别墅靠海，但厕所瓷砖自由了🪟',
        },
        veryGood: {
          one: '可以和余额宝掰掰手腕了😎',
          second: '至少够付咖啡钱了（星巴克除外）😊',
          third: '恭喜击败了全国60%的散户！φ(゜▽゜*)♪',
        },
        excellent: {
          one: '这次，是市场v了你50💰',
          second: 'A peace of cake😎',
          third: '恭喜你成为全国10%的顶尖投资者😎',
        },
        unbelievable: {
          one: '不是哥们，这对吗？（；´д｀）ゞ',
          second: '富哥，v50看看实力(´▽`ʃ♡ƪ)',
          third: '是谁偷走了我的人生😣',
        },
        legendary: {
          one: '口瓜？口瓜！',
        },
      },
      easterEggHint: '口瓜？',
    },
    setting: {
      title: '策略参数设置',
      currentParameters: '当前参数',
      buttons: {
        save: '保存当前参数',
        load: '读取已保存参数',
      },
      dialog: {
        save: {
          title: '保存策略参数',
          confirm: '保存',
          cancel: '取消',
          nameLabel: '策略名称',
          namePlaceholder: '请输入策略名称',
          nameError: '策略名称只能包含字母、数字或中文，且最多7个字符',
        },
        load: {
          title: '读取策略参数',
          confirm: '读取',
          cancel: '取消',
          noSelection: '请选择一个策略',
        },
      },
      table: {
        columns: {
          name: '策略名称',
          time: '创建时间',
          strategy: '策略类型',
          actions: '操作',
        },
        actions: {
          delete: '删除',
          deleteConfirm: '确认删除吗',
        },
      },
      messages: {
        saveSuccess: '策略参数保存成功',
        loadSuccess: '策略参数读取成功',
        deleteSuccess: '删除成功',
        emptyName: '请输入策略名称',
      },
      parameters: {
        // 回测配置参数
        strategy: '策略类型',
        symbol: '股票代码',
        initialCapital: '初始资金',
        commission: '手续费率',
        holdingPeriod: '持仓周期',
        startDate: '开始日期',
        endDate: '结束日期',

        // 通用策略参数
        shareHoldingLimit: '持股上限',
        profitHoldThreshold: '盈利达标持有',
        trailingStopPercent: '动态止盈保护',
        stopLossLimit: '风险控制止损',

        // 均线交叉策略参数
        shortPeriod: '短期均线',
        longPeriod: '长期均线',

        // RSI策略参数
        rsiPeriod: 'RSI周期',
        overbought: '超买线',
        oversold: '超卖线',

        // 布林带策略参数
        bollingerBandsPeriod: '布林带周期',
        standardDeviationMultiple: '标准差倍数',
      },
      strategyTypes: {
        ma_cross: '均线交叉',
        rsi_reversal: 'RSI反转',
        bollinger_bands: '布林带',
      },
      units: {
        shares: '支',
        percent: '%',
      },
    },
    strategyParams: {
      title: '策略参数',
      common: {
        shareHoldingLimit: {
          label: '最大持股上限',
          tip: '最大可持有的股票数量',
          suffix: '支',
        },
        profitHoldThreshold: {
          label: '盈利达标持有',
          tip: '达到此盈利百分比时继续持有',
          suffix: '%',
        },
        trailingStopPercent: {
          label: '动态止盈保护',
          tip: '从最高点回落此百分比时卖出',
          suffix: '%',
        },
        stopLossLimit: {
          label: '风险控制止损',
          tip: '亏损达到此百分比时强制止损',
          suffix: '%',
        },
      },
      maCross: {
        shortPeriod: {
          label: '短期均线',
          tip: '短期移动平均线的周期',
        },
        longPeriod: {
          label: '长期均线',
          tip: '长期移动平均线的周期',
        },
      },
      rsiReversal: {
        rsiPeriod: {
          label: 'RSI周期',
          tip: '相对强弱指标的计算周期',
        },
        overbought: {
          label: '超买线',
          tip: 'RSI高于此值视为超买区域',
        },
        oversold: {
          label: '超卖线',
          tip: 'RSI低于此值视为超卖区域',
        },
      },
      bollingerBands: {
        bollingerBandsPeriod: {
          label: '布林带周期',
          tip: '布林带的计算周期',
        },
        standardDeviationMultiple: {
          label: '标准差倍数',
          tip: '布林带宽度的标准差倍数',
        },
      },
      customCode: {
        title: '已启用自定义代码',
        subTitle: '可再次点击以禁用自定义代码',
      },
    },
  },
  new: {
    title: '新建策略',
    ma: '均线交叉策略',
    rsi: 'RSI反转策略',
    bollinger: '布林带策略',
    columns: {
      name: '片段名称',
      createTime: '创建时间',
      updateTime: '更新时间',
      op: '操作',
    },
    strategyInfo: '策略信息',
    strategyNamePlaceholder: '请输入策略名称',
    strategyDescPlaceholder: '请输入策略描述',
    codeVisualization: '代码可视化',
    flowchart: '流程图',
    dependency: '依赖关系',
    flowchartPlaceholder: '代码流程图将在此处显示',
    dependencyPlaceholder: '代码依赖关系将在此处显示',
    reset: '重置',
    save: '保存',
    deployTest: '部署测试',
    formReset: '表单已重置',
    nameRequired: '请输入策略名称',
    codeRequired: '策略代码不能为空',
    saveSuccess: '策略已保存',
    saveFailed: '保存失败',
    pageRedirect: '页面跳转',
    redirectNotice: '页面将在3秒后自动跳转，请勿关闭',
    codeValidationPass: '代码验证通过',
    codeValidationPassMsg: '您的策略代码格式正确，可以继续操作。',
    codeValidationFail: '代码验证失败',
    codeWarnings: '代码警告',
    found: '发现',
    errorCount: '个错误',
    warnCount: '个警告',
    codeEditing: {
      strategyCode: '策略代码',
      templateButton: '代码模板',
      fullscreenEdit: '全屏编辑',
      exitFullscreen: '退出全屏',
      DOMerror: '代码渲染出错',
      fullscreenError: '全屏错误：',
      loaded: '已加载',
      template: '模板',
    },
    snippetsCards: {
      title: '我的代码片段',
      dialog: {
        create: {
          title: '新建代码片段',
          name: '片段名称',
          namePlaceholder: '请输入片段名称',
          description: '代码描述',
          descriptionPlaceholder: '请输入代码描述',
          confirm: '确定',
          cancel: '取消',
        },
        delete: {
          title: '删除确认',
          message: '确定要删除代码片段 "{name}" 吗？此操作不可恢复。',
          confirm: '确定',
          cancel: '取消',
        },
        button: {
          create: '新建片段',
          edit: '编辑',
          delete: '删除',
        },
        tooltip: {
          load: '点击加载此代码片段',
          edit: '编辑',
          delete: '删除',
        },
        table: {
          emptyText: '暂无代码片段',
        },
      },
      messages: {
        createSuccess: '代码片段已创建',
        deleteSuccess: '代码片段已删除',
        loadSuccess: '已加载代码片段: {name}',
      },
    },
  },
  history: {
    title: '回测历史记录',
    sortByTime: '按时间排序',
    sortByReturn: '按收益率排序',
    detailTitle: '回测详情',
    basicInfo: '基本信息',
    riskAnalysis: '风险分析',
    backtestConfig: '回测配置',
    backtestResult: '回测结果',
    strategyParams: '策略参数',
    riskMetrics: '风险指标',
    backtestTime: '回测时间',
    strategyName: '策略名称',
    stockCode: '股票代码',
    backtestRange: '回测区间',
    initialCapital: '初始资金',
    commissionRate: '手续费率',
    totalReturn: '总收益率',
    annualReturn: '年化收益率',
    maxDrawdown: '最大回撤',
    sharpeRatio: '夏普比率',
    totalTrades: '交易次数',
    winRate: '胜率',
    action: '操作',
    volatility: '波动率',
    betaCoefficient: 'Beta系数',
    holdingPeriod: '持仓周期',
    positionUtilization: '仓位利用率',
    days: '天',
    viewDetail: '详情',
    delete: '删除',
    confirmDelete: '确认删除吗',
    queryError: '查询回测记录失败',
    queryFailed: '查询失败',
    deleteSuccess: '删除成功',
    deleteError: '删除回测记录失败',
    deleteFailed: '删除失败',
    initError: '回测存储初始化失败',
    initFailed: '初始化失败',
    shareHoldingLimit: '持股限制',
    profitHoldThreshold: '盈利持有阈值',
    trailingStopPercent: '追踪止损百分比',
    stopLossLimit: '止损限制',
    shortPeriod: '短周期',
    longPeriod: '长周期',
    rsiPeriod: 'RSI周期',
    overbought: '超买阈值',
    oversold: '超卖阈值',
    bollingerBandsPeriod: '布林带周期',
    standardDeviationMultiple: '标准差倍数',
  },
}
