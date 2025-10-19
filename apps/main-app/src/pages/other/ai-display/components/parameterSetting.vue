<template>
  <t-form :data="testConfig" label-width="10rem">
    <t-form-item label="总操作数">
      <t-input-number v-model="testConfig.totalOperations" :min="10" :max="500" />
    </t-form-item>

    <t-form-item label="模拟用户数量">
      <t-input-number v-model="testConfig.userCount" :min="1" :max="100" />
    </t-form-item>

    <t-form-item label="每步的特征维度">
      <t-input-number v-model="testConfig.featureDimensions" :min="1" :max="10" />
    </t-form-item>

    <t-form-item label="每个用户行为序列长度">
      <t-input-number v-model="testConfig.sequenceLength" :min="0" :max="100" :step="1" />
    </t-form-item>
    <t-form-item label="操作间顺序依赖强度">
      <t-input-number v-model="testConfig.operationTransitionBias" :min="0" :max="1" :step="0.01" />
    </t-form-item>

    <t-form-item label="单次会话时长范围">
      <t-range-input v-model="testConfig.sessionDurationRange" suffix="s" style="width: 11rem" />
    </t-form-item>
  </t-form>
</template>
<script setup lang="ts">
defineProps({
  testConfig: {
    type: Object,
    default: () => ({
      totalOperations: 100,
      userCount: 50,
      sessionDurationRange: [300, 3600],
      featureDimensions: 8,
      sequenceLength: 10,
      operationTransitionBias: 0.8,
    }),
  },
})
</script>
