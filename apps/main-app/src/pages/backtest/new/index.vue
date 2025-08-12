<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="strategy-page">
    <!-- 页面头部 -->
    <t-card class="header-card">
      <div class="header-content">
        <div class="left">
          <h2 class="title">{{ isEditing ? '编辑策略' : '新建策略' }}</h2>
        </div>
        <div class="right">
          <t-space>
            <t-button theme="default" @click="resetForm">重置</t-button>
            <t-button theme="primary" @click="saveStrategy">保存</t-button>
            <t-button theme="success" @click="deployStrategy">部署测试</t-button>
          </t-space>
        </div>
      </div>
    </t-card>

    <!-- 策略信息表单 -->
    <t-card class="strategy-info-card" title="策略信息" hover-shadow>
      <t-form ref="form" :data="formData" :rules="rules as any" label-width="120px">
        <t-form-item label="策略名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入策略名称" />
        </t-form-item>
        <t-form-item label="策略描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入策略描述" />
        </t-form-item>
      </t-form>
    </t-card>

    <!-- 代码编辑区 -->
    <t-card class="code-editor-card" title="策略代码" hover-shadow>
      <template #actions>
        <t-dropdown :options="snippetOptions" @click="handleSnippetSelect">
          <t-button variant="text">
            <template #icon>
              <template-icon />
            </template>
            代码模板
          </t-button>
        </t-dropdown>
        <t-button variant="text" @click="toggleFullscreen">
          <template #icon>
            <fullscreen-icon />
          </template>
          {{ '全屏编辑' }}
        </t-button>
        <t-dialog v-model:visible="isFullscreen" top="0" width="90vw" :header="false">
          <div class="full-screen-editor">
            <editor
              v-model="codeContent"
              :language="language"
              :options="editorOptions as any"
              @editor-mounted="editorMounted"
              @change="onChange"
            />
          </div>
        </t-dialog>
      </template>
      <div class="editor-container">
        <editor
          v-model="codeContent"
          :language="language"
          :options="editorOptions as any"
          @editor-mounted="editorMounted"
          @change="onChange"
        />
      </div>
    </t-card>

    <!-- 代码片段列表 -->
    <t-card class="snippets-card" title="我的代码片段" hover-shadow>
      <template #actions>
        <t-button theme="primary" variant="text" @click="createNewSnippet">
          <template #icon>
            <add-icon />
          </template>
          新建片段
        </t-button>
      </template>
      <t-table
        :data="snippetsList"
        :columns="columns"
        row-key="id"
        hover
        stripe
        :loading="tableLoading"
        empty-text="暂无代码片段"
      >
        <template #name="{ row }">
          <t-tooltip content="点击加载此代码片段">
            <span class="snippet-name" @click="loadSnippet(row)">{{ row.name }}</span>
          </t-tooltip>
        </template>
        <template #createTime="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
        <template #updateTime="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
        <template #op="slotProps">
          <t-space>
            <t-tooltip content="编辑">
              <t-button
                theme="primary"
                variant="text"
                size="small"
                @click="editSnippet(slotProps.row)"
              >
                <template #icon>
                  <edit-icon />
                </template>
              </t-button>
            </t-tooltip>
            <t-tooltip content="删除">
              <t-button
                theme="danger"
                variant="text"
                size="small"
                @click="confirmDelete(slotProps.row)"
              >
                <template #icon>
                  <delete-icon />
                </template>
              </t-button>
            </t-tooltip>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 代码可视化区域 -->
    <t-card class="visualization-card" title="代码可视化" hover-shadow>
      <t-tabs v-model="activeTab">
        <t-tab-panel value="flowchart" label="流程图">
          <div class="visualization-placeholder">
            <t-empty description="代码流程图将在此处显示" />
          </div>
        </t-tab-panel>
        <t-tab-panel value="dependency" label="依赖关系">
          <div class="visualization-placeholder">
            <t-empty description="代码依赖关系将在此处显示" />
          </div>
        </t-tab-panel>
      </t-tabs>
    </t-card>

    <!-- 新建/编辑代码片段对话框 -->
    <t-dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? '新建代码片段' : '编辑代码片段'"
      width="500px"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消', theme: 'default' }"
      @confirm="confirmDialog"
      @cancel="cancelDialog"
    >
      <t-form :data="snippetForm" :rules="snippetRules as any">
        <t-form-item label="片段名称" name="name">
          <t-input v-model="snippetForm.name" placeholder="请输入片段名称" />
        </t-form-item>
        <t-form-item label="代码描述" name="description">
          <t-textarea v-model="snippetForm.description" placeholder="请输入代码描述" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 删除确认对话框 -->
    <t-dialog
      v-model:visible="deleteDialogVisible"
      header="删除确认"
      width="400px"
      :confirm-btn="{ content: '确定', theme: 'danger' }"
      :cancel-btn="{ content: '取消', theme: 'default' }"
      @confirm="confirmDeleteSnippet"
      @cancel="deleteDialogVisible = false"
    >
      <p>确定要删除代码片段 "{{ currentSnippet?.name }}" 吗？此操作不可恢复。</p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next'
import { AddIcon, EditIcon, DeleteIcon, TemplateIcon, FullscreenIcon } from 'tdesign-icons-vue-next'

import editor from '@/components/editor/index.vue'
import { useCustomCode, useBacktestStore } from '@/stores'
import router from '@/router'

let worker

// 表单数据
const formData = reactive({
  name: '',
  description: '',
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入策略名称', type: 'error' }],
}

// 编辑器相关
const codeContent = ref(`/**
 * 交易策略函数
 *
 * @param {Object} backtestConfig - 回测配置参数
 * @param {Object} strategyParams - 策略参数
 * @param {Array} stocksData - 股票历史数据数组
 * @returns {Object} 回测结果对象
 */
const runStrategy = (backtestConfig, strategyParams, stocksData) => {
  // 初始化结果对象
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 在这里实现您的交易策略逻辑

  return result;
}
/**
 * 根据历史数据生成交易策略的回测结果
 *
 * @param {Object} backtestConfig - 回测配置参数
 *   @property {string} strategy - 策略名称（必填），目前支持'ma_cross'均线交叉, 'rsi_reversal'RSI反转, 'bollinger_bands'布林带）
 *   @property {string} symbol - 测试的股票代码
 *   @property {string[]} dateRange - 回测日期范围 [开始日期, 结束日期]
 *   @property {number} initialCapital - 初始资金（单位：元）
 *   @property {number} commission - 交易手续费率（如0.0003表示0.03%）
 *
 * @param {Object} strategyParams - 策略参数
 *   @property {number} holdingPeriod - 最大持仓周期（天）
 *   @property {number} shareHoldingLimit - 最大持股数量
 *   @property {number} profitHoldThreshold - 盈利持仓阈值（百分比）
 *   @property {number} trailingStopPercent - 移动止损百分比
 *   @property {number} stopLossLimit - 止损百分比
 *   // 均线交叉策略专有参数
 *   @property {number} shortPeriod - 短期均线周期
 *   @property {number} longPeriod - 长期均线周期
 *   // RSI策略专有参数
 *   @property {number} rsiPeriod - RSI计算周期
 *   @property {number} overbought - 超买阈值
 *   @property {number} oversold - 超卖阈值
 *   // 布林带策略专有参数
 *   @property {number} bollingerBandsPeriod - 布林带计算周期
 *   @property {number} standardDeviationMultiple - 标准差倍数
 *
 * @param {Array} stocksData - 股票历史数据数组
 *   @property {string} date - 日期（YYYY-MM-DD格式）
 *   @property {number} open - 开盘价
 *   @property {number} high - 当日最高价
 *   @property {number} low - 当日最低价
 *   @property {number} close - 收盘价
 *   @property {number} volume - 成交量
 *   @property {number} change - 价格变动
 *   @property {number} changePercent - 价格变动百分比
 *   @property {string} marketState - 市场状态（如"NORMAL"正常交易）
 *   @property {number} bid - 买一价
 *   @property {number} ask - 卖一价
 *   @property {number} bidSize - 买一量
 *   @property {number} askSize - 卖一量
 *   @property {number} spread - 买卖价差
 *
 * @returns {Object} 回测结果对象
 *   @property {number} totalReturn - 总收益率（百分比）
 *   @property {number} annualReturn - 年化收益率（百分比）
 *   @property {number} maxDrawdown - 最大回撤（百分比）
 *   @property {number} sharpeRatio - 夏普比率（风险调整后收益）
 *   @property {number} totalTrades - 总交易次数
 *   @property {number} winRate - 胜率（百分比）
 *   @property {number} avgWin - 平均盈利（百分比）
 *   @property {number} avgLoss - 平均亏损（百分比）
 *   @property {Array} trades - 所有交易记录
 *     @property {number} id - 交易ID
 *     @property {string} date - 交易日期
 *     @property {string} type - 交易类型（"买入"/"卖出"）
 *     @property {string} price - 成交价格
 *     @property {number} quantity - 交易数量（股）
 *     @property {string} amount - 交易金额
 *     @property {string} profit - 盈亏金额
 *     @property {string} totalValue - 交易后总资产
 *   @property {Array} equityCurve - 每日资产曲线
 *     @property {string} date - 日期
 *     @property {number} value - 当日资产总值
 *   @property {number} positionPeriod - 平均持仓周期（天）
 *   @property {number} volatility - 年化波动率（百分比）
 *   @property {number} Beta - 贝塔系数（市场相关性）
 *   @property {number} positionUtilizationRate - 仓位利用率（百分比）
 *   @property {number} correlationAnalysis - 与大盘相关性（0-1）
 *   @property {number} sectorDistribution - 行业分布（1表示单只股票）
 */`)
const language = ref('javascript')
const isFullscreen = ref(false)
const editorOptions = reactive({
  automaticLayout: true,
  foldingStrategy: 'indentation',
  renderLineHighlight: 'all',
  selectOnLineNumbers: true,
  minimap: {
    enabled: true,
  },
  readOnly: false,
  contextmenu: true,
  fontSize: 14,
  scrollBeyondLastLine: false,
  overviewRulerBorder: false,
})

// 代码片段相关
const customCodeStore = useCustomCode()
const backtestStore = useBacktestStore()
const snippetsList = computed(() => customCodeStore.snippets)
const tableLoading = ref(false)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const currentSnippet = ref(null)
const isValid = ref(true)
const editors = []
const snippetForm = reactive({
  name: '',
  code: '',
  description: '',
})
const snippetRules = {
  name: [{ required: true, message: '请输入片段名称', type: 'error' }],
}

// 代码模板选项
const snippetOptions = [
  { content: '均线交叉策略', value: 'ma_cross' },
  { content: 'RSI反转策略', value: 'rsi_reversal' },
  { content: '布林带策略', value: 'bollinger_bands' },
]

// 表格列定义
const columns = [
  { colKey: 'name', title: '片段名称', width: 200 },
  { colKey: 'createTime', title: '创建时间', width: 180 },
  { colKey: 'updateTime', title: '更新时间', width: 180 },
  { colKey: 'op', title: '操作', width: 100 },
]

// 可视化相关
const activeTab = ref('flowchart')
const isEditing = ref(false)

// 编辑器挂载完成
const editorMounted = (editorInstance) => {
  console.log('编辑器实例加载完成', editorInstance)
  editors.push(editorInstance)
}

// 代码变更事件
const onChange = () => {
  console.log('代码已更改')
}

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 格式化日期
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

// 加载代码片段
const loadSnippet = (snippet) => {
  codeContent.value = snippet.code
  MessagePlugin.success(`已加载代码片段: ${snippet.name}`)
}

// 创建新代码片段
const createNewSnippet = () => {
  dialogMode.value = 'create'
  snippetForm.name = formData.name
  snippetForm.description = formData.description
  snippetForm.code = codeContent.value
  dialogVisible.value = true
}

// 编辑代码片段
const editSnippet = (snippet) => {
  currentSnippet.value = snippet
  formData.name = snippet.name
  formData.description = snippet.description
  codeContent.value = snippet.code
  MessagePlugin.success(`已加载代码片段: ${snippet.name}`)
}

// 确认删除对话框
const confirmDelete = (snippet) => {
  currentSnippet.value = snippet
  deleteDialogVisible.value = true
}

// 确认删除代码片段
const confirmDeleteSnippet = () => {
  if (currentSnippet.value) {
    customCodeStore.deleteSnippet(currentSnippet.value.id)
    MessagePlugin.success('代码片段已删除')
    deleteDialogVisible.value = false
  }
}

// 确认对话框
const confirmDialog = async () => {
  if (!snippetForm.name.trim()) {
    MessagePlugin.error('请输入片段名称')
    return
  }

  worker.postMessage(codeContent.value)
  dialogVisible.value = false
}

// 取消对话框
const cancelDialog = () => {
  dialogVisible.value = false
}

// 保存策略
const saveStrategy = () => {
  if (!formData.name.trim()) {
    MessagePlugin.error('请输入策略名称')
    return
  }
  if (!codeContent.value.trim()) {
    MessagePlugin.error('策略代码不能为空')
    return
  }
  try {
    customCodeStore.addSnippet(formData.name, codeContent.value, formData.description)
  } catch (err) {
    MessagePlugin.error(err.message)
    return
  }
  // 这里可以添加保存策略的逻辑
  MessagePlugin.success('策略已保存')
}

// 部署测试
const deployStrategy = async () => {
  if (!formData.name.trim()) {
    MessagePlugin.error('请先填写策略名称')
    return
  }

  if (!codeContent.value.trim()) {
    MessagePlugin.error('策略代码不能为空')
    return
  }
  backtestStore.getBacktestResult.isCustomCode = true
  await worker.postMessage(codeContent.value)
  NotifyPlugin.success({
    title: '页面跳转',
    content: '页面将在3秒后自动跳转，请勿关闭',
    duration: 3000,
    closeBtn: true,
    placement: 'top-right',
  })
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.description = ''
  codeContent.value = `/**
 * 交易策略函数
 *
 * @param {Object} backtestConfig - 回测配置参数
 * @param {Object} strategyParams - 策略参数
 * @param {Array} stocksData - 股票历史数据数组
 * @returns {Object} 回测结果对象
 */
const runStrategy = (backtestConfig, strategyParams, stocksData) => {
  // 初始化结果对象
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 在这里实现您的交易策略逻辑

  return result;
}
/**
 * 根据历史数据生成交易策略的回测结果
 *
 * @param {Object} backtestConfig - 回测配置参数
 *   @property {string} strategy - 策略名称（必填），目前支持'ma_cross'均线交叉, 'rsi_reversal'RSI反转, 'bollinger_bands'布林带）
 *   @property {string} symbol - 测试的股票代码
 *   @property {string[]} dateRange - 回测日期范围 [开始日期, 结束日期]
 *   @property {number} initialCapital - 初始资金（单位：元）
 *   @property {number} commission - 交易手续费率（如0.0003表示0.03%）
 *
 * @param {Object} strategyParams - 策略参数
 *   @property {number} holdingPeriod - 最大持仓周期（天）
 *   @property {number} shareHoldingLimit - 最大持股数量
 *   @property {number} profitHoldThreshold - 盈利持仓阈值（百分比）
 *   @property {number} trailingStopPercent - 移动止损百分比
 *   @property {number} stopLossLimit - 止损百分比
 *   // 均线交叉策略专有参数
 *   @property {number} shortPeriod - 短期均线周期
 *   @property {number} longPeriod - 长期均线周期
 *   // RSI策略专有参数
 *   @property {number} rsiPeriod - RSI计算周期
 *   @property {number} overbought - 超买阈值
 *   @property {number} oversold - 超卖阈值
 *   // 布林带策略专有参数
 *   @property {number} bollingerBandsPeriod - 布林带计算周期
 *   @property {number} standardDeviationMultiple - 标准差倍数
 *
 * @param {Array} stocksData - 股票历史数据数组
 *   @property {string} date - 日期（YYYY-MM-DD格式）
 *   @property {number} open - 开盘价
 *   @property {number} high - 当日最高价
 *   @property {number} low - 当日最低价
 *   @property {number} close - 收盘价
 *   @property {number} volume - 成交量
 *   @property {number} change - 价格变动
 *   @property {number} changePercent - 价格变动百分比
 *   @property {string} marketState - 市场状态（如"NORMAL"正常交易）
 *   @property {number} bid - 买一价
 *   @property {number} ask - 卖一价
 *   @property {number} bidSize - 买一量
 *   @property {number} askSize - 卖一量
 *   @property {number} spread - 买卖价差
 *
 * @returns {Object} 回测结果对象
 *   @property {number} totalReturn - 总收益率（百分比）
 *   @property {number} annualReturn - 年化收益率（百分比）
 *   @property {number} maxDrawdown - 最大回撤（百分比）
 *   @property {number} sharpeRatio - 夏普比率（风险调整后收益）
 *   @property {number} totalTrades - 总交易次数
 *   @property {number} winRate - 胜率（百分比）
 *   @property {number} avgWin - 平均盈利（百分比）
 *   @property {number} avgLoss - 平均亏损（百分比）
 *   @property {Array} trades - 所有交易记录
 *     @property {number} id - 交易ID
 *     @property {string} date - 交易日期
 *     @property {string} type - 交易类型（"买入"/"卖出"）
 *     @property {string} price - 成交价格
 *     @property {number} quantity - 交易数量（股）
 *     @property {string} amount - 交易金额
 *     @property {string} profit - 盈亏金额
 *     @property {string} totalValue - 交易后总资产
 *   @property {Array} equityCurve - 每日资产曲线
 *     @property {string} date - 日期
 *     @property {number} value - 当日资产总值
 *   @property {number} positionPeriod - 平均持仓周期（天）
 *   @property {number} volatility - 年化波动率（百分比）
 *   @property {number} Beta - 贝塔系数（市场相关性）
 *   @property {number} positionUtilizationRate - 仓位利用率（百分比）
 *   @property {number} correlationAnalysis - 与大盘相关性（0-1）
 *   @property {number} sectorDistribution - 行业分布（1表示单只股票）
 */`
  MessagePlugin.success('表单已重置')
}

// 选择代码模板
const handleSnippetSelect = (codeTemplate) => {
  let templateCode = ''

  switch (codeTemplate.value) {
    case 'ma_cross':
      templateCode = `/**
 * 均线交叉策略
 * 当短期均线上穿长期均线时买入，下穿时卖出
 */
function runStrategy(backtestConfig, strategyParams, stocksData) {
  const { shortPeriod, longPeriod } = strategyParams;
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 计算短期和长期移动平均线
  const shortMA = calculateMA(stocksData, shortPeriod);
  const longMA = calculateMA(stocksData, longPeriod);

  // 实现交易逻辑
  // ...

  return result;
}

// 计算移动平均线
function calculateMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push(sum / period);
  }
  return result;
}`
      break
    case 'rsi_reversal':
      templateCode = `/**
 * RSI反转策略
 * 当RSI低于超卖阈值时买入，高于超买阈值时卖出
 */
function runStrategy(backtestConfig, strategyParams, stocksData) {
  const { rsiPeriod, overbought, oversold } = strategyParams;
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 计算RSI指标
  const rsiValues = calculateRSI(stocksData, rsiPeriod);

  // 实现交易逻辑
  // ...

  return result;
}

// 计算RSI指标
function calculateRSI(data, period) {
  const rsi = [];
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }

    const change = data[i].close - data[i-1].close;

    if (i <= period) {
      gains += change > 0 ? change : 0;
      losses += change < 0 ? -change : 0;

      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      } else {
        rsi.push(null);
      }
    } else {
      const avgGain = ((gains * (period - 1)) + (change > 0 ? change : 0)) / period;
      const avgLoss = ((losses * (period - 1)) + (change < 0 ? -change : 0)) / period;

      gains = avgGain;
      losses = avgLoss;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }

  return rsi;
}`
      break
    case 'bollinger_bands':
      templateCode = `/**
 * 布林带策略
 * 当价格触及下轨时买入，触及上轨时卖出
 */
function runStrategy(backtestConfig, strategyParams, stocksData) {
  const { bollingerBandsPeriod, standardDeviationMultiple } = strategyParams;
  const result = {
    totalReturn: 0,
    annualReturn: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    trades: [],
    equityCurve: [],
    positionPeriod: 0,
    volatility: 0,
    Beta: 0,
    positionUtilizationRate: 0,
    correlationAnalysis: 0,
    sectorDistribution: 1
  };

  // 计算布林带
  const { middle, upper, lower } = calculateBollingerBands(stocksData, bollingerBandsPeriod, standardDeviationMultiple);

  // 实现交易逻辑
  // ...

  return result;
}

// 计算布林带
function calculateBollingerBands(data, period, stdDev) {
  const middle = [];
  const upper = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      middle.push(null);
      upper.push(null);
      lower.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const ma = sum / period;

    let squaredDiffSum = 0;
    for (let j = 0; j < period; j++) {
      squaredDiffSum += Math.pow(data[i - j].close - ma, 2);
    }
    const stdDevValue = Math.sqrt(squaredDiffSum / period);

    middle.push(ma);
    upper.push(ma + (stdDevValue * stdDev));
    lower.push(ma - (stdDevValue * stdDev));
  }

  return { middle, upper, lower };
}`
      break
  }

  if (templateCode) {
    codeContent.value = templateCode
    MessagePlugin.success(
      `已加载${snippetOptions.find((item) => item.value === codeTemplate.value)?.content}模板`,
    )
  }
}

// 页面加载时初始化
onMounted(() => {
  worker = new Worker(new URL('@/workers/worker.js', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e) => {
    isValid.value = e.data.isValid
    if (e.data.isValid) {
      NotifyPlugin.success({
        title: '代码验证通过',
        content: '您的策略代码格式正确，可以继续操作。',
        duration: 3000,
        closeBtn: true,
        placement: 'top-right',
      })
      if (!backtestStore.getBacktestResult.func) {
        if (dialogMode.value === 'create') {
          try {
            customCodeStore.addSnippet(snippetForm.name, codeContent.value, snippetForm.description)
          } catch (err) {
            MessagePlugin.error(err.message)
            return
          }
          MessagePlugin.success('代码片段已创建')
        } else {
          customCodeStore.updateSnippet(currentSnippet.value.id, {
            name: snippetForm.name,
            code: codeContent.value,
          })
          MessagePlugin.success('代码片段已更新')
        }
      } else {
        const parseCode = new Function(`
      ${codeContent.value}
      return runStrategy;  // 返回目标函数
    `)
        backtestStore.getBacktestResult.func = parseCode()
        setTimeout(async () => {
          router.push('/backtest/template')
        }, 3000)
      }
    } else {
      // 如果有错误，显示错误通知
      if (e.data.errors && e.data.errors.length > 0) {
        NotifyPlugin.error({
          title: '代码验证失败',
          content: `发现 ${e.data.errors.length} 个错误：${e.data.errors.join('; ')}`,
          duration: 5000,
          closeBtn: true,
        })
      }
    }
    // 如果有警告，显示警告通知
    if (e.data.warnings && e.data.warnings.length > 0) {
      NotifyPlugin.warning({
        title: '代码警告',
        content: `发现 ${e.data.warnings.length} 个警告：${e.data.warnings.join('; ')}`,
        duration: 4000,
        closeBtn: true,
      })
    }
  }
})
onBeforeUnmount(() => {
  worker.terminate()
  for (const editor of editors) {
    editor.dispose()
  }
})
</script>

<style scoped lang="less">
.strategy-page {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }
    }
  }

  .strategy-info-card,
  .code-editor-card,
  .snippets-card,
  .visualization-card {
    margin-bottom: 20px;
  }

  .full-screen-editor {
    position: relative;
    width: 100%;
    height: 600px;
  }

  .editor-container {
    height: 400px;
  }

  .snippet-name {
    color: var(--td-brand-color);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .visualization-placeholder {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
