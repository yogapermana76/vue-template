/**
 * HTTP interceptors for the API.
 *
 * Combines two concerns on a single axios instance:
 *   1. Auth — inject Bearer token, single-flight refresh queue, session-expired flush + redirect.
 *   2. Error — surface business/network errors via toast (unless the caller opts out or the
 *      response carries structured `{ title, desc }` data that a UI component will render itself).
 */

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { config } from '@/config'
import { STORAGE_KEYS } from '@/utils/storage/keys'
import { AuthEndpoint } from '@/services/endpoints'
import type { ApiErrorData } from '@/types'

// ── Public types ──────────────────────────────────────────────────────────

/** Extended Axios config with per-request opt-outs. */
export type HttpConfig = AxiosRequestConfig & {
  showErrorToast?: boolean
  /** Opt-out from the auto success toast on mutation methods. Defaults to `true`. */
  showSuccessToast?: boolean
  /** Per-request opt-out from the refresh-and-retry mechanism. */
  skipTokenRefresh?: boolean
}

type RequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  showErrorToast?: boolean
  showSuccessToast?: boolean
  skipTokenRefresh?: boolean
}

const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete'])

// ── Auth: refresh queue (module-level singleton) ──────────────────────────

let isRefreshing = false
let pendingRequests: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const drainQueue = (error: unknown, token: string | null = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else if (token) resolve(token)
  })
  pendingRequests = []
}

const getAccessToken = (): string | null => sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
const getRefreshToken = (): string | null => sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

// Dependency-injected so this module doesn't import store/router directly —
// static imports would create a circular chain (store → services → here → store).
let onSessionExpired: (() => void) | null = null

export function registerSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler
}

// Guard so concurrent 401s only trigger one toast + one redirect.
let sessionExpiredHandled = false

const handleSessionExpired = () => {
  if (sessionExpiredHandled) return
  sessionExpiredHandled = true
  setTimeout(() => {
    sessionExpiredHandled = false
  }, 5000)

  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.ROLE)

  toast.error('Sesi berakhir', {
    description: 'Silakan login kembali.',
  })

  onSessionExpired?.()
}

/** Hit `POST /v2/auth/refresh` with the current refresh token. */
async function refreshTokenRequest(): Promise<string> {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token')

  const client = axios.create({
    baseURL: config.api.baseUrl,
    // Short timeout: if refresh hangs, the whole request queue hangs. Better to
    // fail fast → drainQueue rejects pending requests → handleSessionExpired redirects.
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${refresh}`,
    },
  })

  const { data } = await client.post(AuthEndpoint.REFRESH)

  // API uses `success: true` as the success signal (no `code` field).
  const succeeded = data?.success !== false && !!data?.data?.AccessToken
  if (!succeeded) {
    throw new Error('Refresh rejected')
  }

  const { AccessToken, RefreshToken } = data.data
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, AccessToken)
  if (RefreshToken) {
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, RefreshToken)
  }
  return AccessToken
}

/** Single-flight refresh: subsequent callers queue on the in-flight request. */
async function refreshWithQueue(): Promise<string> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      pendingRequests.push({ resolve, reject })
    })
  }

  isRefreshing = true
  try {
    const token = await refreshTokenRequest()
    drainQueue(null, token)
    return token
  } catch (err) {
    drainQueue(err)
    handleSessionExpired()
    throw err
  } finally {
    isRefreshing = false
  }
}

// ── Error handling ────────────────────────────────────────────────────────

const SUCCESS_CODE = '2000'
const DEFAULT_ERROR_MESSAGE = 'Something went wrong'

interface ApiResponse {
  success?: boolean
  code?: string
  /** HTTP-style numeric status echoed in the body (API convention). */
  statusCode?: number
  message?: string
  data?: unknown | ApiErrorData
}

/**
 * Detect a business error from a 2xx HTTP response. Handles PLN Mobile
 * (`code` field), API (`statusCode` in body), and generic
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
 * Structured `{ title, desc }` payloads are rendered by the calling component
 * (typically in a bottomsheet), so we skip the toast for those.
 */
const hasStructuredErrorData = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false
  const errorData = (data as ApiResponse).data
  if (!errorData || typeof errorData !== 'object') return false
  return 'title' in errorData && 'desc' in errorData
}

const getErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as ApiResponse | undefined
  return responseData?.message || error.message || DEFAULT_ERROR_MESSAGE
}

const showErrorToast = (message: string) => {
  toast.error('Error', { description: message })
}

// ── Public: wire everything up ────────────────────────────────────────────

/**
 * Attach request + response interceptors. `withAuth=false` skips the Bearer
 * injection + refresh-on-401 flow (for login / public endpoints).
 */
export function setupInterceptors(instance: AxiosInstance, withAuth: boolean) {
  if (withAuth) {
    // Request: inject Bearer token if we have one.
    instance.interceptors.request.use(request => {
      // Never inject on the refresh endpoint itself — its caller supplies its own
      // Authorization header (with the refresh token).
      if (request.url?.includes(AuthEndpoint.REFRESH)) return request

      const access = getAccessToken()
      if (access) {
        request.headers.Authorization = `Bearer ${access}`
      }
      return request
    })
  }

  // Response: business-error detection → toast + reject; 401 → refresh + retry once.
  instance.interceptors.response.use(
    response => {
      if (response.data && isBusinessError(response.data)) {
        const errorMessage = response.data.message || 'Request failed'
        const cfg = response.config as RequestConfig
        const hasUIErrorData = hasStructuredErrorData(response.data)
        const shouldShowToast = cfg.showErrorToast !== false && !hasUIErrorData

        if (shouldShowToast) {
          showErrorToast(errorMessage)
        }

        return Promise.reject({
          response,
          message: errorMessage,
          isBusinessError: true,
        })
      }

      // Mutation methods surface `response.data.message` as a success toast.
      // Opt out per request via `showSuccessToast: false`.
      const cfg = response.config as RequestConfig
      const method = (cfg.method ?? '').toLowerCase()
      if (MUTATION_METHODS.has(method) && cfg.showSuccessToast !== false) {
        const message = (response.data as { message?: string } | undefined)?.message
        if (message) toast.success(message)
      }

      return response
    },
    async (error: AxiosError) => {
      const status = error.response?.status
      const original = error.config as RequestConfig | undefined

      // 401 refresh-and-retry (auth clients only).
      if (
        withAuth &&
        status === 401 &&
        original &&
        !original._retry &&
        !original.skipTokenRefresh &&
        !original.url?.includes(AuthEndpoint.LOGIN) &&
        !original.url?.includes(AuthEndpoint.REFRESH)
      ) {
        original._retry = true
        try {
          const newToken = await refreshWithQueue()
          if (original.headers) {
            original.headers.Authorization = `Bearer ${newToken}`
          }
          return instance(original)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      const hasUIErrorData = hasStructuredErrorData(error.response?.data)
      const shouldShowToast = original?.showErrorToast !== false && !hasUIErrorData

      if (status !== 401 && shouldShowToast) {
        showErrorToast(getErrorMessage(error))
      }

      return Promise.reject(error)
    },
  )
}
