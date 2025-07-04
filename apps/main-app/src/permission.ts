// 导入NProgress的CSS样式
import 'nprogress/nprogress.css'

// 导入NProgress库，用于显示页面加载进度条
import NProgress from 'nprogress'
// 导入消息提示组件
import { MessagePlugin } from 'tdesign-vue-next'
// 导入路由记录类型
import type { RouteRecordRaw } from 'vue-router'

// 导入路由实例
import router from './router/index'
// 导入权限存储和用户存储
import { getPermissionStore, useUserStore } from './stores/index'

// 配置NProgress不显示旋转器
NProgress.configure({ showSpinner: false })

/**
 * 全局前置路由守卫
 * @param to 即将要进入的目标路由
 * @param from 当前导航正要离开的路由
 * @param next 调用该方法来 resolve 这个钩子
 */
router.beforeEach(async (to, from, next) => {
  // 开始显示进度条
  NProgress.start()

  // 获取权限存储实例
  const permissionStore = getPermissionStore()
  // 获取白名单路由列表
  const { whiteListRouters } = permissionStore

  // 获取用户存储实例
  const userStore = useUserStore()

  // 如果用户已登录（存在token）
  if (userStore.user.token) {
    // 如果目标路由是登录页，直接放行（避免已登录用户重复登录）
    if (to.path === '/login') {
      next()
      return
    }

    try {
      // 获取异步路由列表
      const { getAsyncRoutes } = permissionStore

      const asyncRoutes = await getAsyncRoutes()

      asyncRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item)
      })

      // 检查路由是否存在
      if (router.hasRoute(to.name as string)) {
        // 路由存在，放行
        next()
      } else {
        // 路由不存在，重定向到首页
        next(`/result/404`)
      }
    } catch (error: any) {
      // 捕获错误并显示错误消息
      MessagePlugin.error(error.message)
      // 跳转到登录页，并携带当前路径作为重定向参数
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
      // 结束进度条
      NProgress.done()
    }
  } else {
    /* 用户未登录的情况 */
    // 检查目标路由是否在白名单中
    if (whiteListRouters.indexOf(to.path) !== -1) {
      // 在白名单中，直接放行
      next()
    } else {
      // 不在白名单中，跳转到登录页，并携带当前路径作为重定向参数
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
    }
    // 结束进度条
    NProgress.done()
  }
})

/**
 * 全局后置路由守卫
 * @param to 已经进入的目标路由
 */
router.afterEach((to) => {
  // 如果访问的是登录页
  if (to.path === '/login') {
    // 获取用户存储和权限存储实例
    const userStore = useUserStore()
    const permissionStore = getPermissionStore()

    // 执行登出操作
    userStore.logout()
    // 恢复路由到初始状态
    permissionStore.restoreRoutes()
  }
  // 结束进度条
  NProgress.done()
})
