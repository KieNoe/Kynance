<template>
  <t-card :title="t('pages.backtest.strategyParams.title')" class="params-card">
    <t-form :data="strategyParams" label-width="7.5rem">
      <t-form-item
        v-for="item in commonParams"
        :key="item.field"
        :label="t(`pages.backtest.strategyParams.common.${item.field}.label`)"
      >
        <t-tooltip :content="t(`pages.backtest.strategyParams.common.${item.field}.tip`)">
          <t-input-number
            v-model="strategyParams[item.field]"
            :min="item.min"
            :max="item.max"
            :suffix="t(`pages.backtest.strategyParams.common.${item.field}.suffix`) || ''"
            style="width: 9.875rem"
          />
        </t-tooltip>
      </t-form-item>

      <template v-if="backtestConfig.strategy === 'ma_cross'">
        <t-form-item
          v-for="item in maCrossParams"
          :key="item.field"
          :label="t(`pages.backtest.strategyParams.maCross.${item.field}.label`)"
        >
          <t-tooltip :content="t(`pages.backtest.strategyParams.maCross.${item.field}.tip`)">
            <t-input-number
              v-model="strategyParams[item.field]"
              :min="item.min"
              :max="item.max"
              style="width: 9.875rem"
            />
          </t-tooltip>
        </t-form-item>
      </template>

      <template v-if="backtestConfig.strategy === 'rsi_reversal'">
        <t-form-item
          v-for="item in rsiReversalParams"
          :key="item.field"
          :label="t(`pages.backtest.strategyParams.rsiReversal.${item.field}.label`)"
        >
          <t-tooltip :content="t(`pages.backtest.strategyParams.rsiReversal.${item.field}.tip`)">
            <t-input-number
              v-model="strategyParams[item.field]"
              :min="item.min"
              :max="item.max"
              style="width: 9.875rem"
            />
          </t-tooltip>
        </t-form-item>
      </template>

      <template v-if="backtestConfig.strategy === 'bollinger_bands'">
        <t-form-item
          v-for="item in bollingerBandsParams"
          :key="item.field"
          :label="t(`pages.backtest.strategyParams.bollingerBands.${item.field}.label`)"
        >
          <t-tooltip :content="t(`pages.backtest.strategyParams.bollingerBands.${item.field}.tip`)">
            <t-input-number
              v-model="strategyParams[item.field]"
              :min="item.min"
              :max="item.max"
              style="width: 9.875rem"
            />
          </t-tooltip>
        </t-form-item>
      </template>
    </t-form>
  </t-card>
</template>

<script setup lang="ts">
import { t } from '@/infrastructure/locales'
defineProps({
  strategyParams: {
    type: Object,
    required: true,
  },
  backtestConfig: {
    type: Object,
    required: true,
  },
})

const commonParams = [
  { field: 'shareHoldingLimit', label: '持股上限', min: 1, max: 100, suffix: '支' },
  { field: 'profitHoldThreshold', label: '盈利达标持有', min: 1, max: 100, suffix: '%' },
  { field: 'trailingStopPercent', label: '动态止盈保护', min: 1, max: 50, suffix: '%' },
  { field: 'stopLossLimit', label: '风险控制止损', min: 1, max: 80, suffix: '%' },
]

const maCrossParams = [
  { field: 'shortPeriod', label: '短期均线', min: 5, max: 50 },
  { field: 'longPeriod', label: '长期均线', min: 10, max: 200 },
]

const rsiReversalParams = [
  { field: 'rsiPeriod', label: 'RSI周期', min: 5, max: 30 },
  { field: 'overbought', label: '超买线', min: 70, max: 90 },
  { field: 'oversold', label: '超卖线', min: 10, max: 30 },
]

const bollingerBandsParams = [
  { field: 'bollingerBandsPeriod', label: '布林带周期', min: 5, max: 50 },
  { field: 'standardDeviationMultiple', label: '标准差倍数', min: 1, max: 50 },
]
</script>

<style lang="less">
@import url(../index.less);
</style>
