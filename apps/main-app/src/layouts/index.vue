<template>
  <t-layout class="out-layout" style="height: 100vh">
    <LayoutHeader />
    <t-layout>
      <t-aside style="border-top: 1px solid var(--component-border)">
        <LSideNav style="height: 100%" />
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
import LSideNav from './components/LayoutSideNav.vue'
import setting from './setting.vue'
</script>
