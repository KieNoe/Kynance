<template>
  <div class="scene" ref="scene">
    <div class="card" ref="card" :style="cardStyle">
      <!-- 卡片正面 -->
      <div class="card-face card-front">
        <slot name="front"></slot>
      </div>
      <!-- 卡片背面 -->
      <div class="card-face card-back">
        <slot name="back"></slot>
      </div>
      <!-- 卡片其他面（可选） -->
      <div class="card-face card-right"></div>
      <div class="card-face card-left"></div>
      <div class="card-face card-top"></div>
      <div class="card-face card-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const scene = ref(null)
const card = ref(null)

const rotation = ref({ x: 20, y: -20 })
const isDragging = ref(false)
const previousMousePosition = ref({ x: 0, y: 0 })

const cardStyle = ref({
  transform: 'rotateX(20deg) rotateY(-20deg)',
  transition: 'transform 0.5s',
})

const handleMouseDown = (e) => {
  isDragging.value = true
  previousMousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
  cardStyle.value.transition = 'none'
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return

  const deltaMove = {
    x: e.clientX - previousMousePosition.value.x,
    y: e.clientY - previousMousePosition.value.y,
  }

  rotation.value = {
    x: rotation.value.x + deltaMove.y * 0.5,
    y: rotation.value.y + deltaMove.x * 0.5,
  }

  updateCardTransform()

  previousMousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  cardStyle.value.transition = 'transform 0.5s'
}

const updateCardTransform = () => {
  cardStyle.value.transform = `rotateX(${rotation.value.x}deg) rotateY(${rotation.value.y}deg)`
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)

  if (scene.value) {
    scene.value.addEventListener('mousedown', handleMouseDown)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)

  if (scene.value) {
    scene.value.removeEventListener('mousedown', handleMouseDown)
  }
})
</script>

<style scoped>
.scene {
  width: 300px;
  height: 400px;
  perspective: 1000px;
  margin: 0 auto;
  cursor: grab;
}

.scene:active {
  cursor: grabbing;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-front {
  background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
  transform: translateZ(150px);
}

.card-back {
  background: linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 100%);
  transform: rotateY(180deg) translateZ(150px);
}

.card-right {
  background: linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%);
  transform: rotateY(90deg) translateZ(150px);
}

.card-left {
  background: linear-gradient(45deg, #ffc3a0 0%, #ffafbd 100%);
  transform: rotateY(-90deg) translateZ(150px);
}

.card-top {
  background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%);
  transform: rotateX(90deg) translateZ(150px);
  height: 300px; /* 调整高度以适应立方体 */
}

.card-bottom {
  background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
  transform: rotateX(-90deg) translateZ(150px);
  height: 300px; /* 调整高度以适应立方体 */
}
</style>
