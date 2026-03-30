/**
 * Application Configuration
 * Centralized configuration management with type safety
 */

import { z } from 'zod'

// ============================================
// Environment Schema Validation
// ============================================

const envSchema = z.object({
  VITE_APP_NAME: z.string().optional(),
  VITE_APP_URL: z.string().optional(),
  VITE_API_BASE_URL: z.string().optional(),
  VITE_API_AUTH_URL: z.string().optional(),
  VITE_API_USER_URL: z.string().optional(),
  VITE_API_PAYMENT_URL: z.string().optional(),
  VITE_GA_ID: z.string().optional(),
  DEV: z.boolean(),
  PROD: z.boolean(),
})

/**
 * Validate environment variables at startup
 * Warns in console if validation fails (doesn't throw to allow defaults)
 */
function validateEnv(): void {
  const result = envSchema.safeParse(import.meta.env)
  if (!result.success && import.meta.env.DEV) {
    console.warn('[Config] Environment validation warnings:', result.error.issues)
  }
}

// Run validation on module load (dev only)
if (import.meta.env.DEV) {
  validateEnv()
}

// ============================================
// Configuration
// ============================================

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'PLN Mobile Web',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  },

  api: {
    timeout: 30000,
    services: {
      main: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
      auth:
        import.meta.env.VITE_API_AUTH_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        'https://dummyjson.com',
      user:
        import.meta.env.VITE_API_USER_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        'https://dummyjson.com',
      payment:
        import.meta.env.VITE_API_PAYMENT_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        'https://dummyjson.com',
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

  features: {
    analytics: !!import.meta.env.VITE_GA_ID,
    debugMode: import.meta.env.DEV,
    /** Demo mode allows mock authentication */
    demoMode: import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true',
  },

  ui: {
    // 'webview' = mobile app style (bottom nav, fixed width)
    // 'desktop' = website style (top nav, responsive)
    mode: 'webview' as 'webview' | 'desktop',
    maxWidth: 480,
  },
} as const

export type AppConfig = typeof config
