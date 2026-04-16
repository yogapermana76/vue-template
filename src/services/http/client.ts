/**
 * HTTP Client Factory
 * Creates configured Axios instances
 */

import axios, { type AxiosInstance } from 'axios'
import { config } from '@/config'
import { setupAuthInterceptor, setupErrorInterceptor } from './interceptors'

type AuthMode = 'jwt' | 'none'

/**
 * Create HTTP client with optional auth
 */
export function createHttpClient(baseURL: string, authMode: AuthMode = 'jwt'): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  // Setup interceptors
  if (authMode === 'jwt') {
    setupAuthInterceptor(instance)
  }

  setupErrorInterceptor(instance, authMode === 'jwt')

  return instance
}
