type Environment = 'development' | 'staging' | 'production'

export const env = (import.meta.env.VITE_ENV || 'development') as Environment

export const isDev = env === 'development'
export const isStaging = env === 'staging'
export const isProd = env === 'production'

export const config = {
  env,
  app: {
    name: import.meta.env.VITE_APP_NAME || 'PLN Mobile Web',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },

  api: {
    timeout: 30000,
    url: {
      base: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
      // Add more API endpoints here as needed
      // Example:
      // payment: import.meta.env.VITE_API_PAYMENT_URL || 'https://payment-api.example.com',
    },
  },

  auth: {
    tokenExpiry: 60 * 60 * 24, // 24 hours in seconds
  },

  cache: {
    defaultStaleTime: 5 * 60 * 1000, // 5 minutes
    longStaleTime: 30 * 60 * 1000, // 30 minutes
    defaultGcTime: 10 * 60 * 1000, // 10 minutes
  },

  ui: {
    // 'auto' = auto-detect native app vs browser (recommended)
    // 'native' = force native app mode (mobile app webview with bottom nav safe area)
    // 'browser' = force browser mode (regular web, no safe area)
    mode: 'auto' as 'auto' | 'native' | 'browser',
    maxWidth: 425,
    // Set to true to disable dark mode and force light mode
    disableDarkMode: true,
    // Safe area bottom padding for native app webview with bottom navigation
    // Used when app is embedded in mobile app webview with bottom tab bar
    safeAreaBottom: 80, // in pixels, adjust based on native app bottom nav height
  },
} as const

export type AppConfig = typeof config
