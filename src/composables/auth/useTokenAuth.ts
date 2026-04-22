import { ref } from 'vue'
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
  const prevToken = ref<string>()

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

  const handleTokenChange = (token?: string) => {
    // Only process if token actually changed
    if (token === prevToken.value) return
    prevToken.value = token
    processAuth(token)
  }

  return {
    processAuth,
    handleTokenChange,
  }
}
