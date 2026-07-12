import axios from 'axios'
import { config } from '@/config'
import { setupInterceptors } from './interceptors'

// `withAuth` flips the Bearer + refresh-on-401 flow. Error interceptor is always on.
function createHttpClient(withAuth: boolean) {
  const instance = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
  setupInterceptors(instance, withAuth)
  return instance
}

export const http = createHttpClient(true)
export const publicHttp = createHttpClient(false)

export { registerSessionExpiredHandler } from './interceptors'
export { stripEmpty } from './params'
export type { HttpConfig } from './interceptors'
