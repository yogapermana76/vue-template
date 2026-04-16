/**
 * Router Configuration
 * File-based routing with auto-generated routes from src/pages/
 */

import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { config } from '@/config'
import { useAuthService } from '@/composables/services'
import { saveAuthQueryParams } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

let authInitialized = false

const initializeAuth = async (route: RouteLocationNormalized) => {
  if (authInitialized) return
  authInitialized = true

  // Save query params for token refresh
  saveAuthQueryParams(route.query)

  const { checkAuth } = useAuthService()
  const token = route.query?.token as string | undefined
  await checkAuth(token)
}

router.beforeEach(async to => {
  // Update document title
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | ${config.app.name}` : config.app.name

  // Initialize auth on first navigation
  await initializeAuth(to)
})

export default router

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
  }
}
