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

const paramsChanged = (stored: LocationQuery | null, current: LocationQuery): boolean => {
  return !stored || JSON.stringify(stored) !== JSON.stringify(current)
}

const authenticateUser = async (route: RouteLocationNormalized) => {
  const stored = authStorage.getAuthFromApps<LocationQuery>()
  const isChanged = paramsChanged(stored, route.query)

  if (isChanged && route.query.token) {
    saveAuthQueryParams(route.query)
  }

  if (authInitialized && !isChanged) return
  authInitialized = true

  const { checkAuth } = useAuthService()
  await checkAuth(route.query.token as string | undefined)
}

router.beforeEach(async to => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | ${config.app.name}` : config.app.name

  const stored = authStorage.getAuthFromApps<LocationQuery>()
  const isChanged = paramsChanged(stored, to.query)
  const hasNewToken = isChanged && to.query.token

  // If token changed in URL, re-authenticate (blocking)
  // Otherwise authenticate in background (non-blocking for faster first load)
  if (hasNewToken) {
    authInitialized = false
    await authenticateUser(to)
  } else {
    authenticateUser(to)
  }
})

export default router

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
  }
}
