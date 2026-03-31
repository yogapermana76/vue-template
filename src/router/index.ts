/**
 * Router Configuration
 *
 * File-based routing dengan Vue Router 5.
 * Routes auto-generated dari src/pages/
 */

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { config } from '@/config'
import { useAuthState } from '@/composables/auth'

// ============================================
// Router Instance
// ============================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

// ============================================
// Navigation Guards
// ============================================

router.beforeEach(to => {
  // Update document title
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | ${config.app.name}` : config.app.name

  // Check auth
  const { isAuthenticated } = useAuthState()

  // Protected route - redirect to login
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // Guest route - redirect to home if authenticated
  if (to.meta.guest && isAuthenticated.value) {
    return '/'
  }
})

export default router

// ============================================
// Type Augmentation
// ============================================

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    guest?: boolean
  }
}
