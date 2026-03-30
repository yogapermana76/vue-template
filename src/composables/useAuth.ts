import { computed, ref, readonly } from 'vue'
import { useStorage } from '@vueuse/core'
import { config } from '@/config'
import { getErrorMessage, STORAGE_KEYS } from '@/utils'

// ============================================
// Types
// ============================================

export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// ============================================
// State
// ============================================

const token = useStorage<string | null>(STORAGE_KEYS.AUTH_TOKEN, null)
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const isAuthenticated = computed(() => {
  if (!token.value) return false
  return !isTokenExpired(token.value)
})

// ============================================
// Helpers
// ============================================

function isTokenExpired(tokenValue: string): boolean {
  try {
    const payload = JSON.parse(atob(tokenValue.split('.')[1] || ''))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const DEMO = {
  email: 'demo@example.com',
  password: 'password',
  user: { id: '1', name: 'Demo User' },
}

async function mockLogin(credentials: LoginCredentials) {
  await new Promise(r => setTimeout(r, 800))

  if (credentials.email === DEMO.email && credentials.password === DEMO.password) {
    // Create mock JWT format: header.payload.signature
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: DEMO.user.id,
        email: credentials.email,
        exp: Math.floor(Date.now() / 1000) + config.auth.tokenExpiry,
      }),
    )
    const signature = btoa('mock-signature')

    return {
      token: `${header}.${payload}.${signature}`,
      user: {
        id: DEMO.user.id,
        email: credentials.email,
        name: DEMO.user.name,
      },
    }
  }

  throw new Error('Invalid email or password')
}

// ============================================
// Actions
// ============================================

async function login(credentials: LoginCredentials) {
  isLoading.value = true
  error.value = null

  try {
    const result = config.features.demoMode
      ? await mockLogin(credentials)
      : await Promise.reject(new Error('Production auth not implemented'))

    token.value = result.token
    user.value = result.user
    return { success: true }
  } catch (e) {
    error.value = getErrorMessage(e)
    return { success: false, error: error.value }
  } finally {
    isLoading.value = false
  }
}

function logout() {
  token.value = null
  user.value = null
  error.value = null
}

function clearError() {
  error.value = null
}

// ============================================
// Composables
// ============================================

export function useAuth() {
  return {
    // State (readonly)
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Actions
    login,
    logout,
    clearError,
  }
}

export function useAuthState() {
  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
  }
}

export function useAuthActions() {
  return { login, logout }
}

export function useAuthLoading() {
  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError,
  }
}
