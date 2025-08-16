<!-- eslint-disable vue/no-mutating-props -->
<template>
  <t-card :title="t('pages.backtest.template.strategyParams.title')" class="params-card">
    <template #actions>
      <t-button theme="default" shape="square" variant="text" @click="handleStrategyParamsClick">
        <EllipsisIcon />
      </t-button>
    </template>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <t-form
          :data="strategyParams"
          label-width="7.5rem"
          v-if="!backtestStore.getBacktestResult.isCustomCode"
        >
          <t-form-item
            v-for="item in commonParams"
            :key="item.field"
            :label="t(`pages.backtest.template.strategyParams.common.${item.field}.label`)"
          >
            <t-tooltip
              :content="t(`pages.backtest.template.strategyParams.common.${item.field}.tip`)"
            >
              <t-input-number
                v-model="strategyParams[item.field]"
                :min="item.min"
                :max="item.max"
                :suffix="
                  t(`pages.backtest.template.strategyParams.common.${item.field}.suffix`) || ''
                "
                style="width: 9.875rem"
              />
            </t-tooltip>
          </t-form-item>

          <template v-if="backtestConfig.strategy === 'ma_cross'">
            <t-form-item
              v-for="item in maCrossParams"
              :key="item.field"
              :label="t(`pages.backtest.template.strategyParams.maCross.${item.field}.label`)"
            >
              <t-tooltip
                :content="t(`pages.backtest.template.strategyParams.maCross.${item.field}.tip`)"
              >
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
              :label="t(`pages.backtest.template.strategyParams.rsiReversal.${item.field}.label`)"
            >
              <t-tooltip
                :content="t(`pages.backtest.template.strategyParams.rsiReversal.${item.field}.tip`)"
              >
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
              :label="
                t(`pages.backtest.template.strategyParams.bollingerBands.${item.field}.label`)
              "
            >
              <t-tooltip
                :content="
                  t(`pages.backtest.template.strategyParams.bollingerBands.${item.field}.tip`)
                "
              >
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
        <div class="result-success" v-else>
          <CodeIcon class="result-success-icon" />
          <div class="result-success-title">
            {{ t('pages.backtest.template.strategyParams.customCode.title') }}
          </div>
          <div class="result-success-describe">
            {{ t('pages.backtest.template.strategyParams.customCode.subTitle') }}
          </div>
        </div>
      </keep-alive></transition
    >
  </t-card>
</template>

<script setup lang="ts">
import { EllipsisIcon } from 'tdesign-icons-vue-next'
import { CodeIcon } from 'tdesign-icons-vue-next'

import { t } from '@/infrastructure/locales'
import { useBacktestStore } from '@/stores'
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

const backtestStore = useBacktestStore()

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

const handleStrategyParamsClick = () => {
  backtestStore.getBacktestResult.isCustomCode = !backtestStore.getBacktestResult.isCustomCode
}
</script>

<style lang="less">
@import url(../index.less);
.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.result-success {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 19.5rem;

  &-icon {
    font-size: var(--td-comp-size-xxxxl);
    color: var(--td-brand-color);
    padding-right: 0.13em;
  }

  &-title {
    margin-top: var(--td-comp-margin-xxl);
    font: var(--td-font-title-large);
    color: var(--td-text-color-primary);
    text-align: center;
  }

  &-describe {
    margin: var(--td-comp-margin-s) 0 var(--td-comp-margin-xxxl);
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
  }
}
</style>
