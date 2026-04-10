import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { config } from '@/config'
import { storage, STORAGE_KEYS } from '@/utils'

type ServiceName = keyof typeof config.api.services

function createHttpClient(service: ServiceName): AxiosInstance {
  const instance = axios.create({
    baseURL: config.api.services[service],
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(req => {
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  })

  instance.interceptors.response.use(
    res => res,
    error => {
      if (error.response?.status === 401) {
        storage.remove(STORAGE_KEYS.AUTH_TOKEN)
        window.location.href = '/demo/login'
      }
      return Promise.reject(error)
    },
  )

  return instance
}

// Pre-configured instances for each service
export const http = createHttpClient('main')
export const authHttp = createHttpClient('auth')
export const userHttp = createHttpClient('user')
export const paymentHttp = createHttpClient('payment')

// Factory for custom/dynamic services
export { createHttpClient }
export type { AxiosRequestConfig }
