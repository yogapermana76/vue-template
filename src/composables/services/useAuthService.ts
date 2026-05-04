import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authStorage } from '@/utils'
import { normalizeToken } from '@/utils/auth'

export function useAuthService() {
  const authStore = useAuthStore()
  const isLoading = ref(false)

  /**
   * Restore session from localStorage
   */
  const restoreSession = (): boolean => {
    const existingToken = authStorage.getToken()
    if (!existingToken) return false

    if (!authStore.isAuthenticated) {
      authStore.restoreSession()
    }
    return true
  }

  /**
   * Authenticate with token
   */
  const authenticate = async (token: string): Promise<boolean> => {
    isLoading.value = true

    try {
      const normalizedToken = normalizeToken(token)
      const res = await authStore.authenticate({ token: normalizedToken })
      return res.code === '2000'
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check and initialize authentication
   * Authenticates with provided token or restores from localStorage
   */
  const checkAuth = async (token?: string): Promise<boolean> => {
    // Prioritize token from query params if provided
    if (token) {
      return await authenticate(token)
    }

    // Fallback to restore from localStorage
    if (restoreSession()) return true

    return false
  }

  /**
   * Logout and clear session
   */
  const logout = () => {
    authStore.logout()
  }

  return {
    isLoading,
    checkAuth,
    authenticate,
    restoreSession,
    logout,
  }
}
