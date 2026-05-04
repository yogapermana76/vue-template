import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'
import { authStorage } from '@/utils'
import type { User, SyncAccountRequest } from '@/types'

interface AuthState {
  user: User | null
  tokenJwt: string | null
  isInitialized: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: authStorage.getUser<User>(),
    tokenJwt: authStorage.getToken(),
    isInitialized: false,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: state => !!state.tokenJwt && !!state.user,
    currentUser: state => state.user,
    token: state => state.tokenJwt,
  },

  actions: {
    /**
     * Authenticate user by exchanging URL token for JWT
     * @param param - Login request with token
     * @returns Response from auth service
     */
    async authenticate(param: SyncAccountRequest) {
      this.isLoading = true
      try {
        const response = await authService.syncAccount(param)

        if (response.code === '2000' && response.data) {
          // Successful authentication
          this.user = response.data.user
          this.tokenJwt = `${response.data.tokenType} ${response.data.token}`

          // Persist to localStorage
          authStorage.setUser(this.user)
          authStorage.setToken(this.tokenJwt)
        }

        return response
      } finally {
        this.isLoading = false
        this.isInitialized = true
      }
    },

    /**
     * Logout user and clear session
     */
    logout() {
      this.user = null
      this.tokenJwt = null
      authStorage.clearSession()
      return true
    },

    /**
     * Restore auth state from localStorage
     */
    restoreSession() {
      this.user = authStorage.getUser<User>()
      this.tokenJwt = authStorage.getToken()
      this.isInitialized = true
    },

    /**
     * Reset initialization flag for re-authentication
     */
    resetInitialization() {
      this.isInitialized = false
      this.user = null
      this.tokenJwt = null
    },
  },
})
