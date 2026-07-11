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
import type { ApiErrorData } from '@/types'

type RequestConfig = InternalAxiosRequestConfig & {
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
  /** HTTP-style numeric status echoed in the body (Loket convention). */
  statusCode?: number
  message?: string
  data?: unknown | ApiErrorData
}

/**
 * Detect a business error from a 2xx HTTP response. Handles PLN Mobile
 * (`code` field), Loket (`statusCode` in body), and generic
 * (`success: false`) response shapes.
 */
const isBusinessError = (data: unknown): data is ApiResponse => {
  if (!data || typeof data !== 'object') return false

  const response = data as ApiResponse

  if (response.success === false) return true
  if (response.code !== undefined && response.code !== SUCCESS_CODE) return true
  if (response.statusCode !== undefined && response.statusCode >= 400) return true

  return false
}

/**
 * Check if error has structured data for UI display (bottomsheet)
 * These errors should NOT show toast - they will be handled by component
 */
const hasStructuredErrorData = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false

  const response = data as ApiResponse
  const errorData = response.data

  if (!errorData || typeof errorData !== 'object') return false

  return 'title' in errorData && 'desc' in errorData
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
 * Setup response interceptor for error handling. Loket auth (Bearer +
 * refresh on 401) is handled in `loket-interceptors.ts`; this interceptor
 * just surfaces error messages via toast.
 */
export const setupErrorInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    response => {
      if (response.data && isBusinessError(response.data)) {
        const errorMessage = response.data.message || 'Request failed'

        const config = response.config as RequestConfig
        const hasUIErrorData = hasStructuredErrorData(response.data)
        const shouldShowToast = config.showErrorToast !== false && !hasUIErrorData

        if (shouldShowToast) {
          showErrorToast(errorMessage)
        }

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

      const hasUIErrorData = hasStructuredErrorData(error.response?.data)
      const shouldShowToast = config?.showErrorToast !== false && !hasUIErrorData

      if (status !== 401 && shouldShowToast) {
        showErrorToast(getErrorMessage(error))
      }

      return Promise.reject(error)
    },
  )
}
