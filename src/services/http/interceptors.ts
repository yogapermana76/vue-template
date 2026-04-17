/**
 * HTTP Interceptors
 * Request and response interceptors for Axios
 */

import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios'
import { toast } from 'vue-sonner'
import { authStorage } from '@/utils'
import { refreshTokenWithQueue } from './token-refresh'

type RequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  showErrorToast?: boolean
}

/**
 * Extended Axios config with showErrorToast option
 */
export type HttpConfig = AxiosRequestConfig & {
  showErrorToast?: boolean
}

const SUCCESS_CODE = '2000'
const DEFAULT_ERROR_MESSAGE = 'Something went wrong'

interface ApiResponse {
  success?: boolean
  code?: string
  message?: string
  data?: unknown
}

/**
 * Check if response is a business logic error
 * API returns 200 but with success: false or code !== '2000'
 */
const isBusinessError = (data: unknown): data is ApiResponse => {
  if (!data || typeof data !== 'object') return false

  const response = data as ApiResponse
  return (
    response.success === false || (response.code !== undefined && response.code !== SUCCESS_CODE)
  )
}

/**
 * Extract error message from Axios error
 */
const getErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as ApiResponse | undefined
  return responseData?.message || error.message || DEFAULT_ERROR_MESSAGE
}

/**
 * Show error toast notification
 */
const showErrorToast = (message: string) => {
  toast.error('Error', { description: message })
}

/**
 * Setup request interceptor to inject JWT token
 */
export const setupAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
    const token = authStorage.getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  })
}

/**
 * Handle 401 unauthorized error with token refresh
 */
const handleUnauthorized = async (error: AxiosError, instance: AxiosInstance): Promise<unknown> => {
  const originalRequest = error.config as RequestConfig

  if (!originalRequest || originalRequest._retry) {
    return Promise.reject(error)
  }

  originalRequest._retry = true

  try {
    const newToken = await refreshTokenWithQueue()

    if (originalRequest.headers) {
      originalRequest.headers.Authorization = newToken
    }

    return instance(originalRequest)
  } catch (refreshError) {
    authStorage.clearSession()
    return Promise.reject(refreshError)
  }
}

/**
 * Setup response interceptor for error handling
 */
export const setupErrorInterceptor = (instance: AxiosInstance, withAuth: boolean) => {
  instance.interceptors.response.use(
    response => {
      // Check for business logic errors in successful HTTP responses
      if (response.data && isBusinessError(response.data)) {
        const errorMessage = response.data.message || 'Request failed'

        // Show toast only if not explicitly disabled
        const config = response.config as RequestConfig
        const shouldShowToast = config.showErrorToast !== false
        if (shouldShowToast) {
          showErrorToast(errorMessage)
        }

        // Reject as error so it can be caught in try-catch
        return Promise.reject({
          response,
          message: errorMessage,
          isBusinessError: true,
        })
      }

      return response
    },
    async (error: AxiosError) => {
      const status = error.response?.status
      const config = error.config as RequestConfig

      // Handle 401 with token refresh for authenticated clients
      if (status === 401 && withAuth) {
        return handleUnauthorized(error, instance)
      }

      // Clear session on 401 for non-auth clients
      if (status === 401) {
        authStorage.clearSession()
      }

      // Show toast for non-401 errors only if not explicitly disabled
      const shouldShowToast = config?.showErrorToast !== false
      if (status !== 401 && shouldShowToast) {
        showErrorToast(getErrorMessage(error))
      }

      return Promise.reject(error)
    },
  )
}
