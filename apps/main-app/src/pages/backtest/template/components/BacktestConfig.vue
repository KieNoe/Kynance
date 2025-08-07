<template>
  <t-card title="回测配置" class="config-card">
    <t-form :data="backtestConfig" label-width="5rem">
      <t-form-item label="策略名称">
        <t-select v-model="backtestConfig.strategy" placeholder="请选择策略">
          <t-option value="ma_cross" label="均线交叉策略" />
          <t-option value="rsi_reversal" label="RSI反转策略" />
          <t-option value="bollinger_bands" label="布林带策略" />
        </t-select>
      </t-form-item>

      <t-form-item label="股票代码">
        <t-input v-model="backtestConfig.symbol" placeholder="如：000001" />
      </t-form-item>

      <t-form-item label="回测周期">
        <t-date-range-picker
          v-model="backtestConfig.dateRange"
          format="YYYY-MM-DD"
          placeholder="选择回测时间范围"
        />
      </t-form-item>

      <t-form-item label="初始资金">
        <t-input-number
          v-model="backtestConfig.initialCapital"
          :min="10000"
          :max="10000000"
          suffix="元"
          style="width: 12.5rem"
        />
      </t-form-item>

      <t-form-item label="手续费率">
        <t-input-number
          v-model="backtestConfig.commission"
          :min="0"
          :max="0.01"
          :step="0.0001"
          suffix="%"
          style="width: 12.5rem"
        />
      </t-form-item>
    </t-form>
  </t-card>
</template>
<script setup lang="ts">
defineProps({
  backtestConfig: {
    type: Object,
  },
})
</script>
<style lang="less">
@import url(../index.less);
</style>
