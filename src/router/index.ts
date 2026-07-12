import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { config } from '@/config'
import { useAuthStore } from '@/stores'
import { isAuthPath, isProtectedPath } from './paths'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'instant' }
    return { top: 0, behavior: 'instant' }
  },
})

router.beforeEach(to => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | ${config.app.name}` : config.app.name

  if (to.path === '/') {
    return { path: '/dashboard' }
  }

  const auth = useAuthStore()

  if (isProtectedPath(to.path) && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (auth.isAuthenticated && isAuthPath(to.path)) {
    return { path: '/dashboard' }
  }
})

export default router

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    breadcrumb?: string
    breadcrumbs?: Array<{ label: string; to?: string }>
  }
}
