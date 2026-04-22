import { useRoute } from 'vue-router'
import { type LocationQuery } from 'vue-router'
import { useAuthService } from '@/composables/services'
import { useAuthStore } from '@/stores/auth'
import { authStorage } from '@/utils/storage/auth'
import { saveAuthQueryParams } from '@/utils/auth'

export function useTokenAuth() {
  const route = useRoute()
  const authStore = useAuthStore()
  const { checkAuth } = useAuthService()

  const processAuth = async (token?: string) => {
    if (token) {
      const storedQuery = authStorage.getAuthFromApps<LocationQuery>()
      const tokenChanged = !storedQuery || storedQuery.token !== token

      if (tokenChanged) {
        saveAuthQueryParams(route.query)
        authStore.resetInitialization()
      }
    }

    if (authStore.isInitialized) return

    await checkAuth(token)
  }

  return {
    processAuth,
  }
}
