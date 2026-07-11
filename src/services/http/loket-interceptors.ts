// Loket auth: sessionStorage + POST /v2/auth/refresh, single-flight queue, retry once.
// On unrecoverable refresh failure, flush the store + redirect to /login.

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { config } from '@/config'
import { LOKET_STORAGE_KEYS } from '@/utils/storage/keys'
import { LoketAuthEndpoint } from '@/services/loket/endpoints'

type RequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  /** Per-request opt-out from the refresh-and-retry mechanism. */
  skipTokenRefresh?: boolean
}

// ── Refresh queue (module-level singleton) ────────────────────────────────
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

const getAccessToken = (): string | null => sessionStorage.getItem(LOKET_STORAGE_KEYS.ACCESS_TOKEN)
const getRefreshToken = (): string | null =>
  sessionStorage.getItem(LOKET_STORAGE_KEYS.REFRESH_TOKEN)

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

  sessionStorage.removeItem(LOKET_STORAGE_KEYS.ACCESS_TOKEN)
  sessionStorage.removeItem(LOKET_STORAGE_KEYS.REFRESH_TOKEN)
  sessionStorage.removeItem(LOKET_STORAGE_KEYS.USER)
  sessionStorage.removeItem(LOKET_STORAGE_KEYS.ROLE)

  toast.error('Sesi berakhir', {
    description: 'Silakan login kembali.',
  })

  onSessionExpired?.()
}

/** Hit `POST /v2/auth/refresh` with the current refresh token. */
async function refreshLoketToken(): Promise<string> {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No loket refresh token')

  const client = axios.create({
    baseURL: config.api.url.loket,
    // Short timeout: if refresh hangs, the whole request queue hangs. Better to
    // fail fast → drainQueue rejects pending requests → handleSessionExpired redirects.
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${refresh}`,
    },
  })

  const { data } = await client.post(LoketAuthEndpoint.REFRESH)

  // Loket API uses `success: true` as the success signal (no `code` field).
  const succeeded = data?.success !== false && !!data?.data?.AccessToken
  if (!succeeded) {
    throw new Error('Loket refresh rejected')
  }

  const { AccessToken, RefreshToken } = data.data
  sessionStorage.setItem(LOKET_STORAGE_KEYS.ACCESS_TOKEN, AccessToken)
  if (RefreshToken) {
    sessionStorage.setItem(LOKET_STORAGE_KEYS.REFRESH_TOKEN, RefreshToken)
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
    const token = await refreshLoketToken()
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

/** Attach request + response interceptors to a Loket http instance. */
export function setupLoketAuthInterceptor(instance: AxiosInstance) {
  // Request: inject Bearer token if we have one.
  instance.interceptors.request.use(request => {
    // Never inject on the refresh endpoint itself — its caller supplies its own
    // Authorization header (with the refresh token).
    if (request.url?.includes(LoketAuthEndpoint.REFRESH)) return request

    const access = getAccessToken()
    if (access) {
      request.headers.Authorization = `Bearer ${access}`
    }
    return request
  })

  // Response: on 401, refresh once and retry.
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const original = error.config as RequestConfig | undefined

      if (status !== 401 || !original || original._retry || original.skipTokenRefresh) {
        return Promise.reject(error)
      }

      // Skip retry for the login / refresh endpoints themselves.
      if (
        original.url?.includes(LoketAuthEndpoint.LOGIN) ||
        original.url?.includes(LoketAuthEndpoint.REFRESH)
      ) {
        return Promise.reject(error)
      }

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
    },
  )
}
