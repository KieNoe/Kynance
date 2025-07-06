<script setup lang="ts">
import { useUserStore, useSettingStore } from '@/stores'

const userStore = useUserStore()
const settingStore = useSettingStore()

function change() {
  console.log(userStore.user.name)
  userStore.setUser('name', 'kynance')
  console.log(userStore.user.name)
  console.log(settingStore.mode)
  settingStore.toggleMode()
}
</script>
<template>
  <div>
    <p>Home</p>
    <button @click="change">change</button>
    <router-link to="/watchlists">跳转到观察列表</router-link>
  </div>
</template>
<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
