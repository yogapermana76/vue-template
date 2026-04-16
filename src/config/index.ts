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
    // 'webview' = mobile app style (bottom nav, fixed width)
    // 'desktop' = website style (top nav, responsive)
    mode: 'webview' as 'webview' | 'desktop',
    maxWidth: 425,
  },
} as const

export type AppConfig = typeof config
