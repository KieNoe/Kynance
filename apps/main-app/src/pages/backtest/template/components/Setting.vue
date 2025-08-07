<template>
  <t-space direction="vertical" style="width: 100%">
    <t-card title="策略参数设置" bordered>
      <!-- 显示当前参数 -->
      <t-descriptions :data="parametersList" :column="2" bordered>
        <t-descriptions-item v-for="item in parametersList" :key="item.label" :label="item.label">{{
          item.content
        }}</t-descriptions-item>
      </t-descriptions>

      <!-- 操作按钮 -->
      <t-space style="margin-top: 1.25rem">
        <t-button @click="saveCurrentStrategy" theme="primary">保存当前参数</t-button>
        <t-button @click="showLoadDialog = true">读取已保存参数</t-button>
      </t-space>
    </t-card>

    <!-- 保存参数对话框 -->
    <t-dialog
      v-model:visible="showSaveDialog"
      header="保存策略参数"
      :confirm-btn="{ content: '保存', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="confirmSave"
    >
      <t-form>
        <t-form-item label="策略名称">
          <t-input v-model="saveForm.name" placeholder="请输入策略名称" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 读取参数对话框 -->
    <t-dialog
      v-model:visible="showLoadDialog"
      width="46%"
      header="读取策略参数"
      :confirm-btn="{ content: '读取', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="confirmLoad"
    >
      <t-table
        :data="savedStrategies"
        :columns="(columns as any)"
        row-key="id"
        hover
        @row-click="handleRowClick"
        :activeRowKeys="[selectedStrategy]"
        activeRowType="multiple"
        :pagination="{
          defaultCurrent: 1,
          defaultPageSize: 5,
          total: savedStrategies?.length || 0,
        }"
      >
      </t-table>
    </t-dialog>
  </t-space>
</template>

<script setup lang="tsx">
import { computed, ref } from 'vue'
import { useBacktestStore } from '@/stores'
import { MessagePlugin } from 'tdesign-vue-next'

const props = defineProps({
  backtestConfig: {
    type: Object,
    required: true,
  },
  strategyParams: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:backtestConfig', 'update:strategyParams'])

// 获取回测策略存储
const backtestStore = useBacktestStore()

// 对话框控制
const showSaveDialog = ref(false)
const showLoadDialog = ref(false)

// 保存表单
const saveForm = ref({
  name: '',
})

// 选中的策略ID
const selectedStrategy = ref('')

const parametersList = computed(() => {
  const list = []

  if (props.backtestConfig) {
    Object.entries(props.backtestConfig).forEach(([key, value]) => {
      if (key === 'dateRange' && Array.isArray(value)) {
        list.push({
          label: '开始日期',
          content: value[0],
        })
        list.push({
          label: '结束日期',
          content: value[1],
        })
      } else {
        list.push({
          label: getParameterLabel(key),
          content: value,
        })
      }
    })
  }

  if (props.strategyParams) {
    Object.entries(props.strategyParams).forEach(([key, value]) => {
      list.push({
        label: getParameterLabel(key),
        content: value,
      })
    })
  }

  return list
})

// 获取参数的中文标签
function getParameterLabel(key) {
  const labelMap = {
    // 回测配置参数
    strategy: '策略类型',
    symbol: '股票代码',
    initialCapital: '初始资金',
    commission: '手续费率',

    // 通用策略参数
    holdingPeriod: '持仓周期',
    shareHoldingLimit: '持股限制',
    profitHoldThreshold: '盈利持有阈值',
    trailingStopPercent: '追踪止损百分比',
    stopLossLimit: '止损限制',

    // 均线交叉策略参数
    shortPeriod: '短期均线周期',
    longPeriod: '长期均线周期',

    // RSI策略参数
    rsiPeriod: 'RSI周期',
    overbought: '超买阈值',
    oversold: '超卖阈值',

    // 布林带策略参数
    bollingerBandsPeriod: '布林带周期',
    standardDeviationMultiple: '标准差倍数',
  }

  return labelMap[key] || key
}

const columns = [
  { colKey: 'name', title: '策略名称', width: 150 },
  { colKey: 'time', title: '创建时间', width: 150 },
  {
    colKey: 'strategy',
    title: '策略类型',
    cell: (h, { row }) => {
      const strategyTypeMap = {
        ma_cross: '均线交叉',
        rsi_reversal: 'RSI反转',
        bollinger_bands: '布林带',
      }

      return strategyTypeMap[row.backtestConfig?.strategy] || row.backtestConfig?.strategy
    },
  },
  {
    title: '操作',
    colKey: 'link',
    cell: (h, { row }) => {
      return (
        <t-popconfirm
          content="确认删除吗"
          onConfirm={() => {
            backtestStore.deleteStrategy(row.id)
            savedStrategies.value = backtestStore.getStrategy()
            MessagePlugin.success('删除成功')
          }}
        >
          <t-link>删除</t-link>
        </t-popconfirm>
      )
    },
  },
]

// 已保存的策略列表
const savedStrategies = ref(backtestStore.getStrategy())

// 点击行选择策略
function handleRowClick({ row }) {
  selectedStrategy.value = row.id
}

// 保存当前策略
function saveCurrentStrategy() {
  saveForm.value.name = ''
  showSaveDialog.value = true
}

// 确认保存
function confirmSave() {
  if (!saveForm.value.name.trim()) {
    MessagePlugin.error('请输入策略名称')
    return
  }
  const nameRegex = /^[\w\u4e00-\u9fa5]{1,7}$/
  if (!nameRegex.test(saveForm.value.name)) {
    MessagePlugin.error('策略名称只能包含字母、数字或中文，且最多7个字符')
    return
  }

  try {
    const newStrategy = {
      name: saveForm.value.name,
      backtestConfig: { ...props.backtestConfig },
      strategyParams: { ...props.strategyParams },
    }

    backtestStore.addStrategy(newStrategy)
    MessagePlugin.success('策略参数保存成功')
    showSaveDialog.value = false
  } catch (error) {
    MessagePlugin.error(error.message || '保存失败')
  }
}

// 确认读取
function confirmLoad() {
  if (!selectedStrategy.value) {
    MessagePlugin.warning('请选择一个策略')
    return
  }

  const strategy = backtestStore.getStrategy().find((s) => s.id === selectedStrategy.value)
  if (strategy) {
    emit('update:backtestConfig', { ...strategy.backtestConfig })
    emit('update:strategyParams', { ...strategy.strategyParams })

    MessagePlugin.success('策略参数读取成功')
    showLoadDialog.value = false
    showSaveDialog.value = false
  }
}
</script>

<style scoped>
.t-card {
  margin-bottom: 1em;
}
</style>
