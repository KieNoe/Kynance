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
import { MessagePlugin } from 'tdesign-vue-next'
import { useLocale } from '@/infrastructure/locales/useLocale'
import { navRoutes } from '@/router'

const handleMenuItemClick = (route) => {
  const targetPath = getFullPath(route)
  console.log(targetPath)
  router.push(targetPath).catch(err => {
    MessagePlugin.error('导航失败:', err)
    router.push('/404')
  })
}

const getFullPath = (route) => {
  try {
    // 处理重定向路由
    if (route.redirect) {
      return typeof route.redirect === 'string'
        ? route.redirect
        : router.resolve(route.redirect).href
    }

    // 优先使用完整路径
    if (route.path && !route.path.startsWith('/')) {
      // 如果是相对路径，尝试拼接
      const parentRoute = navRoutes.find(r =>
        r.children?.some(child => child === route)
      )
      return parentRoute
        ? `${parentRoute.path}/${route.path}`.replace(/\/+/g, '/')
        : `/${route.path}`
    }

    // 标准解析
    return router.resolve(route).href || route.path
  } catch (e) {
    MessagePlugin.error('路由解析失败:', route)
    return '/404'
  }
}

const { locale } = useLocale()

const renderMenuTitle = (title) => {
  if (typeof title === 'string') return title
  return title[locale.value]
}
</script>

<style scoped>
.t-menu__item {
  padding-left: var(--td-size-6) !important;
}
</style>
