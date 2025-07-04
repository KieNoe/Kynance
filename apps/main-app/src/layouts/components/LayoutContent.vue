<template>
  <t-content>
    <div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </t-content>
</template>
<style scoped>
.out-layout {
  height: 100vh;
}
.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
