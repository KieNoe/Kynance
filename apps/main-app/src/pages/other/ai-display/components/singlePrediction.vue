<template>
  <section class="panel actions-panel t-card">
    <div class="panel-head">
      <h3>用户操作 (模拟)</h3>
      <small>点击按钮模拟用户行为轨迹</small>
    </div>
    <div class="actions">
      <t-button
        class="action-btn"
        variant="text"
        :loading="loading"
        v-for="(action, index) in ACTIONS"
        @click="addAction(action, index)"
        >{{ action }}</t-button
      >
    </div>

    <div class="history">
      <h4>最近操作</h4>
      <ul>
        <li v-for="action in actionsList"><span class="dot"></span>{{ action }}</li>
      </ul>
    </div>
  </section>

  <!-- 中：预测展示 -->
  <section class="panel predict-panel t-card">
    <div class="panel-head">
      <h3>下一步预测</h3>
      <small>模型推断出的最可能动作（示例）</small>
    </div>

    <div class="predict-area">
      <div class="prediction-card" v-for="prediction in predictionList">
        <div class="pred-label">预测动作</div>
        <div class="pred-action">{{ prediction.label }}</div>
        <div class="confidence">
          <div class="conf-bar">
            <div class="conf-fill" :style="{ width: prediction.value + '%' }"></div>
          </div>
          <div class="conf-text">置信度：{{ prediction.value }}%</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  loading: Boolean,
  predictNextAction: Function,
})

const ACTIONS = ref(['查看商品', '加入购物车', '开始结算', '离开页面'])
const actionsList = ref(['点击: 查看商品', '点击: 加入购物车', '点击: 查看详情'])
const predictionList = ref([
  { label: '开始结算', value: 78 },
  { label: '查看详情', value: 18 },
])

const addAction = async (action, index) => {
  actionsList.value.unshift(`点击: ${action}`)
  if (actionsList.value.length > 3) {
    actionsList.value.pop()
  }
  const prediction = await props.predictNextAction(index + 1)
  const sortedPrediction = prediction.probabilities
    .map((item, index) => ({ probability: item, index }))
    .sort((a, b) => {
      return b.probability - a.probability
    })
  predictionList.value.unshift({
    label: ACTIONS.value[sortedPrediction[1].index],
    value: parseFloat((sortedPrediction[1].probability * 100).toFixed(2)),
  })
  predictionList.value.unshift({
    label: ACTIONS.value[sortedPrediction[0].index],
    value: parseFloat((sortedPrediction[0].probability * 100).toFixed(2)),
  })
  predictionList.value.pop()
  predictionList.value.pop()
}
</script>
<style scoped lang="less">
@import url('../index.less');
</style>
