import { useRoute } from 'vue-router'

/** Post-login redirect. Honours `?redirect=` only for same-origin paths (blocks `//evil.com`). */
export function useAuthRedirect(defaultPath: string) {
  const route = useRoute()

  const resolveRedirect = (): string => {
    const raw = route.query.redirect
    const path = typeof raw === 'string' ? raw : ''
    return path.startsWith('/') && !path.startsWith('//') ? path : defaultPath
  }

  return { resolveRedirect }
}
