<template>
  <t-tabs drag-sort :value="value" theme="card" @drag-sort="onDragend" @change="onTabChange">
    <t-tab-panel
      v-for="data in panelData"
      :key="data.value"
      :value="data.value"
      :label="data.label"
      :draggable="true"
    >
      <p style="padding: 25px">
        {{ data.content }}
      </p>
    </t-tab-panel>
  </t-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { TabsProps } from 'tdesign-vue-next'
const value = ref<TabsProps['value']>('first')
const panelData = ref([
  {
    value: 'first',
    label: '固定的选项卡1',
    content: '选项卡1内容',
  },
  {
    value: 'second',
    label: '可拖拽选项卡2',
    content: '选项卡2内容',
  },
  {
    value: 'third',
    label: '可拖拽的选项卡3',
    content: '选项卡2内容',
  },
])
const onDragend = ({ currentIndex, targetIndex }) => {
  ;[panelData.value[currentIndex], panelData.value[targetIndex]] = [
    panelData.value[targetIndex],
    panelData.value[currentIndex],
  ]
}
const onTabChange = (newValue) => (value.value = newValue)
</script>
