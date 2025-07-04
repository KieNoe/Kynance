<template>
  <template v-for="route in navRoutes" :key="getFullPath(route)">
  <t-submenu
    v-if="route.children && route.children.length > 0"
    :value="getFullPath(route)"
    :title="renderMenuTitle(route.meta?.title as string | Record<string, string>)"
  >
    <template #icon>
      <t-icon :name="(route.meta?.icon as string)" />
    </template>

    <t-menu-item
      v-for="child in route.children"
      :key="getFullPath(child)"
      :value="getFullPath(child)"
      @click="() => handleMenuItemClick(child)"
    >
      <template #icon>
        <t-icon :name="(child.meta?.icon as string)" />
      </template>
      {{ renderMenuTitle(child.meta?.title as string | Record<string, string>) }}
    </t-menu-item>
  </t-submenu>
  </template>
</template>
<script setup lang="ts">
import router from '@/router'

import { useLocale } from '@/infrastructure/locales/useLocale'
import { navRoutes } from '@/router'

const handleMenuItemClick = (route) => {
      if (route.redirect) {
        router.push(route.redirect);
      } else if (getFullPath(route)) {
        router.push(getFullPath(route));
      } else{
        router.push('/404')
      }
    };

const getFullPath = (route) => {
  return router.resolve(route).href
}

const { locale } = useLocale()

const renderMenuTitle = (title) => {
  if (typeof title === 'string') return title
  return title[locale.value]
}
</script>
<style scoped>
.t-menu__item{
  padding-left: var(--td-size-6) !important;
}
</style>
