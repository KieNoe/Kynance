<template>
  <t-footer v-if="settingStore.showFooter"
    >Copyright @ {{ new Date().getFullYear() }} KieNoe. All Rights Reserved</t-footer
  >
</template>
<script lang="ts" setup>
import { useSettingStore } from '@/stores'

const settingStore = useSettingStore()
</script>
