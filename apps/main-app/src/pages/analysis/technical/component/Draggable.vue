<template>
  <div class="sortable-container">
    <TransitionGroup name="sortable-list" tag="div" class="transition-group-container">
      <div
        v-for="(image, index) in images"
        :key="image.id"
        class="sortable-item"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent="handleDragOver($event, index)"
        @dragenter="handleDragEnter($event, index)"
        @dragleave="handleDragLeave($event)"
        @dragend="handleDragEnd"
        @drop.prevent="handleDrop($event, index)"
      >
        <img :src="image.src" style="width: 100%" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useStockDataStore } from '@/stores'
import KLinePng from '@/assets/assets-KLine.png'
import RsiPng from '@/assets/assets-RSI.png'
import StockPng from '@/assets/assets-Stock.png'

const stockDataStore = useStockDataStore()

const images = ref(
  [
    { id: 1, src: StockPng },
    { id: 2, src: KLinePng },
    { id: 3, src: RsiPng },
  ].sort((a, b) => stockDataStore.sortPlace.indexOf(a.id) - stockDataStore.sortPlace.indexOf(b.id)),
)

const draggedIndex = ref(null)
const dragOverIndex = ref(null)

const handleDragStart = (event, index) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.currentTarget.classList.add('dragging')
}

const handleDragOver = (event, index) => {
  event.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

const handleDragEnter = (event, index) => {
  event.currentTarget.classList.add('drag-over')
}

const handleDragLeave = (event) => {
  event.currentTarget.classList.remove('drag-over')
  dragOverIndex.value = null
}

const handleDragEnd = (event) => {
  event.currentTarget.classList.remove('dragging')
  document.querySelectorAll('.sortable-item').forEach((item) => {
    item.classList.remove('drag-over')
  })
  draggedIndex.value = null
  dragOverIndex.value = null
  console.log(images.value)
}

const handleDrop = (event, targetIndex) => {
  event.currentTarget.classList.remove('drag-over')

  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const newImages = [...images.value]
    const [removed] = newImages.splice(draggedIndex.value, 1)
    newImages.splice(targetIndex, 0, removed)
    images.value = newImages
  }

  draggedIndex.value = null
  dragOverIndex.value = null
}

const saveSortPlace = () => {
  stockDataStore.updateSortPlace(images.value.map((item) => item.id))
}
defineExpose({ saveSortPlace })
</script>

<style scoped>
.sortable-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.transition-group-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sortable-item {
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.sortable-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.sortable-item:active {
  cursor: grabbing;
}

.sortable-item.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.sortable-item.drag-over {
  border-top: 3px dashed #3498db;
  background-color: #f0f8ff;
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
  transform: translateX(30px);
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
  background: rgba(52, 152, 219, 0.1);
}
</style>
