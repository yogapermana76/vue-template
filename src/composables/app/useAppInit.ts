import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTokenAuth } from '@/composables/auth'

/**
 * Composable for handling app-level initialization
 * - Processes authentication token on mount
 * - Watches for token changes on homepage
 */
export function useAppInit() {
  const route = useRoute()
  const { processAuth, handleTokenChange } = useTokenAuth()

  // Process authentication token on mount
  onMounted(() => {
    const token = route.query.token as string | undefined
    if (token) {
      processAuth(token)
    }
  })

  // Watch for token changes only on homepage
  watch(
    () => (route.path === '/' ? (route.query.token as string | undefined) : undefined),
    token => {
      if (token !== undefined) {
        handleTokenChange(token)
      }
    },
  )
}
