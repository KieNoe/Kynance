import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const env = import.meta.env.VITE_ENV

const homepageModules = import.meta.glob('./modules/**/homepage.ts', { eager: true })

const fixedModules = import.meta.glob('./modules/**/!(homepage).ts', { eager: true })

const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard/base',
  },
]

export const homepageRouterList: Array<RouteRecordRaw> = mapModuleRouterList(homepageModules)
export const fixedRouterList: Array<RouteRecordRaw> = mapModuleRouterList(fixedModules)

export const allRoutes = [...homepageRouterList, ...fixedRouterList, ...defaultRouterList]
export const navRoutes = [...homepageRouterList, ...fixedRouterList]
export function mapModuleRouterList(modules: any): Array<RouteRecordRaw> {
  const routerList: Array<RouteRecordRaw> = []
  Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    routerList.push(...modList)
  })
  return routerList
}

export const getActive = (maxLevel = 3): string => {
  const route = router.currentRoute.value

  if (!route.path) {
    return ''
  }

  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('')
}

const router = createRouter({
  history: createWebHistory(
    env === 'production' ? '/starter/vue-next/' : import.meta.env.VITE_BASE_URL,
  ),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export default router
