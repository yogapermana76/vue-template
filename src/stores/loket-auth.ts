import { defineStore } from 'pinia'
import { loketAuthService } from '@/services/loket'
import { LOKET_STORAGE_KEYS } from '@/utils/storage/keys'
import type { LoketLoginRequest, LoketRoleData, LoketUserData } from '@/types/services/loket'

interface LoketAuthState {
  user: LoketUserData | null
  role: LoketRoleData | null
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

export const useLoketAuthStore = defineStore('loket-auth', {
  state: (): LoketAuthState => ({
    user: parseStored<LoketUserData>(LOKET_STORAGE_KEYS.USER),
    role: parseStored<LoketRoleData>(LOKET_STORAGE_KEYS.ROLE),
    accessToken: sessionStorage.getItem(LOKET_STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: sessionStorage.getItem(LOKET_STORAGE_KEYS.REFRESH_TOKEN),
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
    /** Uppercase role name for downstream matching (Loket returns mixed case). */
    roleName: state => state.role?.Name?.toUpperCase() ?? null,
  },

  actions: {
    async login(request: LoketLoginRequest) {
      const response = await loketAuthService.login(request)

      if (response.data) {
        this.accessToken = response.data.AccessToken
        this.refreshToken = response.data.RefreshToken
        this.user = response.data.User
        this.role = response.data.Role ?? null

        sessionStorage.setItem(LOKET_STORAGE_KEYS.ACCESS_TOKEN, response.data.AccessToken)
        sessionStorage.setItem(LOKET_STORAGE_KEYS.REFRESH_TOKEN, response.data.RefreshToken)
        sessionStorage.setItem(LOKET_STORAGE_KEYS.USER, JSON.stringify(response.data.User))
        if (response.data.Role) {
          sessionStorage.setItem(LOKET_STORAGE_KEYS.ROLE, JSON.stringify(response.data.Role))
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
      sessionStorage.removeItem(LOKET_STORAGE_KEYS.ACCESS_TOKEN)
      sessionStorage.removeItem(LOKET_STORAGE_KEYS.REFRESH_TOKEN)
      sessionStorage.removeItem(LOKET_STORAGE_KEYS.USER)
      sessionStorage.removeItem(LOKET_STORAGE_KEYS.ROLE)
    },
  },
})
