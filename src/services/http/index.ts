import { config } from '@/config'
import { setupLoketAuthInterceptor } from './loket-interceptors'
import { setupErrorInterceptor } from './interceptors'
import axios from 'axios'

// `withAuth` flips the token-refresh interceptor. Error interceptor is always on.
function createLoketHttpClient(withAuth: boolean) {
  const instance = axios.create({
    baseURL: config.api.url.loket,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (withAuth) {
    setupLoketAuthInterceptor(instance)
  }
  setupErrorInterceptor(instance)

  return instance
}

export const loketHttp = createLoketHttpClient(true)
export const loketPublicHttp = createLoketHttpClient(false)

export { setupLoketAuthInterceptor, registerSessionExpiredHandler } from './loket-interceptors'
export { stripEmpty } from './params'

export type { HttpConfig } from './interceptors'
