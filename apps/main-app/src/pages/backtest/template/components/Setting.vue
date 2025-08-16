<template>
  <t-space direction="vertical" style="width: 100%">
    <t-card :title="t('pages.backtest.template.setting.title')" bordered>
      <!-- 显示当前参数 -->
      <t-descriptions
        :title="t('pages.backtest.template.setting.currentParameters')"
        :data="parametersList"
        :column="2"
        bordered
      >
        <t-descriptions-item v-for="item in parametersList" :key="item.label" :label="item.label">{{
          item.content
        }}</t-descriptions-item>
      </t-descriptions>

      <!-- 操作按钮 -->
      <t-space style="margin-top: 1.25rem">
        <t-button @click="saveCurrentStrategy" theme="primary">{{
          t('pages.backtest.template.setting.buttons.save')
        }}</t-button>
        <t-button @click="showLoadDialog = true">{{
          t('pages.backtest.template.setting.buttons.load')
        }}</t-button>
      </t-space>
    </t-card>

    <!-- 保存参数对话框 -->
    <t-dialog
      v-model:visible="showSaveDialog"
      :header="t('pages.backtest.template.setting.dialog.save.title')"
      :confirm-btn="{
        content: t('pages.backtest.template.setting.dialog.save.confirm'),
        theme: 'primary',
      }"
      :cancel-btn="{ content: t('pages.backtest.template.setting.dialog.save.cancel') }"
      @confirm="confirmSave"
    >
      <t-form>
        <t-form-item :label="t('pages.backtest.template.setting.dialog.save.nameLabel')">
          <t-input
            v-model="saveForm.name"
            :placeholder="t('pages.backtest.template.setting.dialog.save.namePlaceholder')"
          />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 读取参数对话框 -->
    <t-dialog
      v-model:visible="showLoadDialog"
      width="46%"
      :header="t('pages.backtest.template.setting.dialog.load.title')"
      :confirm-btn="{
        content: t('pages.backtest.template.setting.dialog.load.confirm'),
        theme: 'primary',
      }"
      :cancel-btn="{ content: t('pages.backtest.template.setting.dialog.load.cancel') }"
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
import { t } from '@/infrastructure/locales'

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
          label: t('pages.backtest.template.setting.parameters.startDate'),
          content: value[0],
        })
        list.push({
          label: t('pages.backtest.template.setting.parameters.endDate'),
          content: value[1],
        })
      } else {
        list.push({
          label: getParameterLabel(key),
          content: formatParameterValue(key, value),
        })
      }
    })
  }

  if (props.strategyParams) {
    Object.entries(props.strategyParams).forEach(([key, value]) => {
      list.push({
        label: getParameterLabel(key),
        content: formatParameterValue(key, value),
      })
    })
  }

  return list
})

// 格式化参数值显示
function formatParameterValue(key, value) {
  if (key.includes('Percent') || key.includes('Threshold') || key.includes('Limit')) {
    return `${value}` + t('pages.backtest.template.setting.units.percent')
  }

  if (key === 'shareHoldingLimit') {
    return `${value}` + t('pages.backtest.template.setting.units.shares')
  }

  if (key === 'strategy') {
    const translationPath = `pages.backtest.template.setting.strategyTypes.${value}`
    if (t(translationPath)) {
      return t(translationPath)
    }
  }

  return value
}

// 获取参数的中文标签
function getParameterLabel(key) {
  const translationPath = `pages.backtest.template.setting.parameters.${key}`
  if (t(translationPath)) {
    return t(translationPath)
  }
}

const columns = [
  { colKey: 'name', title: t('pages.backtest.template.setting.table.columns.name'), width: 150 },
  { colKey: 'time', title: t('pages.backtest.template.setting.table.columns.time'), width: 150 },
  {
    colKey: 'strategy',
    title: t('pages.backtest.template.setting.table.columns.strategy'),
    cell: (h, { row }) => {
      switch (row.backtestConfig.strategy) {
        case 'ma_cross':
          return t('pages.backtest.template.setting.strategyTypes.ma_cross')
        case 'rsi_reversal':
          return t('pages.backtest.template.setting.strategyTypes.rsi_reversal')
        case 'bollinger_bands':
          return t('pages.backtest.template.setting.strategyTypes.bollinger_bands')
      }
    },
  },
  {
    title: t('pages.backtest.template.setting.table.columns.actions'),
    colKey: 'link',
    cell: (h, { row }) => {
      return (
        <t-popconfirm
          content={t('pages.backtest.template.setting.table.actions.deleteConfirm')}
          onConfirm={() => {
            backtestStore.deleteStrategy(row.id)
            savedStrategies.value = backtestStore.getStrategy()
            MessagePlugin.success(t('pages.backtest.template.setting.messages.deleteSuccess'))
          }}
        >
          <t-link>{t('pages.backtest.template.setting.table.actions.delete')}</t-link>
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
    MessagePlugin.error(t('pages.backtest.template.setting.messages.emptyName'))
    return
  }
  const nameRegex = /^[\w\u4e00-\u9fa5]{1,7}$/
  if (!nameRegex.test(saveForm.value.name)) {
    MessagePlugin.error(t('pages.backtest.template.setting.dialog.save.nameError'))
    return
  }

  try {
    const newStrategy = {
      name: saveForm.value.name,
      backtestConfig: { ...props.backtestConfig },
      strategyParams: { ...props.strategyParams },
    }

    backtestStore.addStrategy(newStrategy)
    MessagePlugin.success(t('pages.backtest.template.setting.messages.saveSuccess'))
    showSaveDialog.value = false
  } catch (error) {
    MessagePlugin.error(error.message || t('common.error.saveFailed'))
  }
}

// 确认读取
function confirmLoad() {
  if (!selectedStrategy.value) {
    MessagePlugin.warning(t('pages.backtest.template.setting.dialog.load.noSelection'))
    return
  }

  const strategy = backtestStore.getStrategy().find((s) => s.id === selectedStrategy.value)
  if (strategy) {
    emit('update:backtestConfig', { ...strategy.backtestConfig })
    emit('update:strategyParams', { ...strategy.strategyParams })

    MessagePlugin.success(t('pages.backtest.template.setting.messages.loadSuccess'))
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
