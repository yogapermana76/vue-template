// Path taxonomies shared by the router guard and the session-expired handler.
export const PROTECTED_PATHS = new Set<string>(['/dashboard', '/monitoring'])
export const AUTH_PATHS = new Set<string>([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
])

// Prefix-guarded roots — any nested route under one of these requires auth.
const PROTECTED_PREFIXES: string[] = ['/voucher-submission']

export const isProtectedPath = (path: string): boolean => {
  if (PROTECTED_PATHS.has(path)) return true
  return PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix))
}
export const isAuthPath = (path: string): boolean => AUTH_PATHS.has(path)
