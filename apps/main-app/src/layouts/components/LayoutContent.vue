<template>
  <t-content>
    <div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" id="main-content" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </t-content>
</template>
<style scoped>
div {
  padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-m);
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
