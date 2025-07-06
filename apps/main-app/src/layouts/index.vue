<template>
  <t-layout class="out-layout" style="height: 100vh">
    <LayoutHeader />
    <t-layout class="inner-layout">
      <t-aside style="border-top: 1px solid var(--component-border)">
        <LayoutSideNav style="height: 100%" />
      </t-aside>
      <t-layout>
        <LayoutContent />
        <LayoutFooter />
      </t-layout>
    </t-layout>
    <setting />
  </t-layout>
</template>
<script lang="ts" setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutSideNav from './components/LayoutSideNav.vue'
import setting from './setting.vue'
</script>
<style scoped lang="less">
.inner-layout {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
  }
}
</style>
