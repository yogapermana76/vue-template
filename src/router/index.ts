/**
 * Router Configuration
 * File-based routing with auto-generated routes from src/pages/
 */

import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type LocationQuery,
} from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { config } from '@/config'
import { useAuthService } from '@/composables/services'
import { saveAuthQueryParams } from '@/utils/auth'
import { authStorage } from '@/utils/storage/auth'

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

/**
 * Check if query params have changed compared to stored params
 */
const hasParamsChanged = (stored: LocationQuery | null, current: LocationQuery): boolean => {
  return !stored || JSON.stringify(stored) !== JSON.stringify(current)
}

const initializeAuth = async (route: RouteLocationNormalized) => {
  const storedParams = authStorage.getAuthFromApps<LocationQuery>()
  const paramsChanged = hasParamsChanged(storedParams, route.query)

  // Always update stored params if query params changed
  if (paramsChanged && route.query.token) {
    saveAuthQueryParams(route.query)
  }

  // Skip auth check if already initialized AND no new token
  if (authInitialized && !paramsChanged) return
  authInitialized = true

  // Check auth with token from query params
  const { checkAuth } = useAuthService()
  await checkAuth(route.query.token as string | undefined)
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
