import { defineStore } from 'pinia'
import { authService } from '@/services'
import { STORAGE_KEYS } from '@/utils/storage/keys'
import type { LoginRequest, RoleData, UserData } from '@/types/services'

interface AuthState {
  user: UserData | null
  role: RoleData | null
  accessToken: string | null
  refreshToken: string | null
}

// Guards against corrupted sessionStorage blobs so store init never throws.
function parseStored<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: parseStored<UserData>(STORAGE_KEYS.USER),
    role: parseStored<RoleData>(STORAGE_KEYS.ROLE),
    accessToken: sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
    /** Uppercase role name for downstream matching (API returns mixed case). */
    roleName: state => state.role?.Name?.toUpperCase() ?? null,
  },

  actions: {
    async login(request: LoginRequest) {
      const response = await authService.login(request)

      if (response.data) {
        this.accessToken = response.data.AccessToken
        this.refreshToken = response.data.RefreshToken
        this.user = response.data.User
        this.role = response.data.Role ?? null

        sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.AccessToken)
        sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.RefreshToken)
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.User))
        if (response.data.Role) {
          sessionStorage.setItem(STORAGE_KEYS.ROLE, JSON.stringify(response.data.Role))
        }
      }

      return response
    },

    logout() {
      this.clearSession()
    },

    clearSession() {
      this.user = null
      this.role = null
      this.accessToken = null
      this.refreshToken = null
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.USER)
      sessionStorage.removeItem(STORAGE_KEYS.ROLE)
    },
  },
})
