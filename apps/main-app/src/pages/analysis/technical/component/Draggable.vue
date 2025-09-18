<template>
  <div class="sortable-container">
    <TransitionGroup name="sortable-list" tag="div" class="transition-group-container">
      <div
        v-for="(image, index) in images"
        :key="image.id"
        class="sortable-item"
        draggable="true"
        :class="{
          dragging: draggedIndex === index,
          'drag-over': dragOverIndex === index,
        }"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent="handleDragOver($event, index)"
        @dragenter="handleDragEnter($event, index)"
        @dragleave="handleDragLeave"
        @dragend="handleDragEnd"
        @drop.prevent="handleDrop($event, index)"
      >
        <img :src="image.src" style="width: 100%" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useSettingStore } from '@/stores'
import { useStockDataStore } from '@/stores'
import KLinePngLight from '@/assets/assets-kline-light.webp'
import RsiPngLight from '@/assets/assets-RSI-light.webp'
import StockPngLight from '@/assets/assets-stock-light.webp'
import StockPngDark from '@/assets/assets-stock-dark.webp'
import KLinePngDark from '@/assets/assets-KLine-dark.webp'
import RsiPngDark from '@/assets/assets-RSI-dark.webp'

const stockDataStore = useStockDataStore()
const settingStore = useSettingStore()

// 使用计算属性获取当前主题
const isDark = computed(() => settingStore.mode !== 'light')

// 图片资源配置，便于维护
const imageResources = [
  {
    id: 1,
    light: StockPngLight,
    dark: StockPngDark,
  },
  {
    id: 2,
    light: KLinePngLight,
    dark: KLinePngDark,
  },
  {
    id: 3,
    light: RsiPngLight,
    dark: RsiPngDark,
  },
]

// 创建响应式图片数组
const images = ref([])

// 更新图片数组的函数
const updateImages = () => {
  images.value = imageResources
    .map((resource) => ({
      id: resource.id,
      src: isDark.value ? resource.dark : resource.light,
    }))
    .sort((a, b) => stockDataStore.sortPlace.indexOf(a.id) - stockDataStore.sortPlace.indexOf(b.id))
}

// 初始化图片
onMounted(() => {
  updateImages()
})

// 拖拽状态管理
const draggedIndex = ref(null)
const dragOverIndex = ref(null)

const handleDragStart = (event, index) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

const handleDragOver = (event, index) => {
  event.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

const handleDragEnter = (event, index) => {
  dragOverIndex.value = index
}

const handleDragLeave = () => {
  dragOverIndex.value = null
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}

const handleDrop = (event, targetIndex) => {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const newImages = [...images.value]
    const [removed] = newImages.splice(draggedIndex.value, 1)
    newImages.splice(targetIndex, 0, removed)
    images.value = newImages

    // 拖拽完成后自动保存排序状态
    saveSortPlace()
  }

  draggedIndex.value = null
  dragOverIndex.value = null
}

// 保存排序状态
const saveSortPlace = () => {
  stockDataStore.updateSortPlace(images.value.map((item) => item.id))
}

// 监听主题变化
const stopWatch = watch(
  () => settingStore.mode,
  () => {
    updateImages()
  },
)

// 导出方法
defineExpose({ saveSortPlace })

// 组件卸载时清理
onUnmounted(() => {
  stopWatch()
  saveSortPlace() // 组件卸载时自动保存排序状态
})
</script>

<style scoped>
.sortable-container {
  width: 100%;
  max-width: 50em;
  margin: 0 auto;
  border-radius: 0.5em;
}

.transition-group-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.sortable-item {
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid var(--td-gray-color-1);
  border-radius: 0.33em;
  overflow: hidden;
  box-shadow: 0 0.0625em 0.1875em var(--bg-color-demo-select);
  position: relative;
}

.sortable-item:hover {
  box-shadow: 0 0.22em 0.44em var(--bg-color-scroll);
  transform: translateY(-0.11em);
}

.sortable-item:active {
  cursor: grabbing;
}

.sortable-item.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 0.33em 0.66em var(--bg-color-scroll);
}

.sortable-item.drag-over {
  border-top: 0.16em dashed var(--td-brand-color-5);
}

.sortable-item img {
  display: block;
  pointer-events: none;
}

/* 过渡动画 */
.sortable-list-move {
  transition: transform 0.3s ease;
}

.sortable-list-enter-active,
.sortable-list-leave-active {
  transition: all 0.3s ease;
}

.sortable-list-enter-from,
.sortable-list-leave-to {
  opacity: 0;
  transform: translateX(1.875em);
}

/* 占位指示器效果 */
.sortable-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  transition: background 0.2s ease;
}

.sortable-item.drag-over::after {
  background: var(--td-mask-disabled);
}
</style>
