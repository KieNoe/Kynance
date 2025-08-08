<template>
  <t-card :title="t('pages.backtest.backtestConfig.title')" class="config-card">
    <t-form :data="backtestConfig" label-width="5rem">
      <t-form-item :label="t('pages.backtest.backtestConfig.strategyName')">
        <t-select
          v-model="backtestConfig.strategy"
          :placeholder="t('pages.backtest.backtestConfig.placeholders.selectStrategy')"
        >
          <t-option
            value="ma_cross"
            :label="t('pages.backtest.backtestConfig.strategies.ma_cross')"
          />
          <t-option
            value="rsi_reversal"
            :label="t('pages.backtest.backtestConfig.strategies.rsi_reversal')"
          />
          <t-option
            value="bollinger_bands"
            :label="t('pages.backtest.backtestConfig.strategies.bollinger_bands')"
          />
        </t-select>
      </t-form-item>

      <t-form-item :label="t('pages.backtest.backtestConfig.stockCode')">
        <t-input
          v-model="backtestConfig.symbol"
          :placeholder="t('pages.backtest.backtestConfig.placeholders.inputStockCode')"
        />
      </t-form-item>

      <t-form-item :label="t('pages.backtest.backtestConfig.backtestPeriod')">
        <t-date-range-picker
          v-model="backtestConfig.dateRange"
          format="YYYY-MM-DD"
          :placeholder="t('pages.backtest.backtestConfig.placeholders.selectDateRange')"
        />
      </t-form-item>

      <t-form-item :label="t('pages.backtest.backtestConfig.initialCapital')">
        <t-input-number
          v-model="backtestConfig.initialCapital"
          :min="10000"
          :max="10000000"
          :suffix="t('pages.backtest.backtestConfig.units.yuan')"
          style="width: 12.5rem"
        />
      </t-form-item>

      <t-form-item :label="t('pages.backtest.backtestConfig.commissionRate')">
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
import { t } from '@/infrastructure/locales'
defineProps({
  backtestConfig: {
    type: Object,
  },
})
</script>
<style lang="less">
@import url(../index.less);
</style>
