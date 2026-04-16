/**
 * Token Refresh Manager
 * Handles JWT token refresh with request queueing
 */

import axios from 'axios'
import { config } from '@/config'
import { authStorage } from '@/utils'
import { AuthEndpoint } from '../endpoints'

// State for managing concurrent refresh requests
let isRefreshing = false
let pendingRequests: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

/**
 * Process all queued requests after token refresh
 */
const processPendingRequests = (error: unknown, token: string | null = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    }
  })
  pendingRequests = []
}

/**
 * Refresh JWT using PLN Mobile token
 */
const refreshToken = async (plnToken: string): Promise<string> => {
  const refreshClient = axios.create({
    baseURL: config.api.url.base,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: plnToken,
    },
  })

  const { data } = await refreshClient.post(AuthEndpoint.SYNC_ACCOUNT, {
    token: plnToken,
  })

  if (data.code !== '2000' || !data.data) {
    throw new Error('Token refresh failed')
  }

  const newToken = `${data.data.tokenType} ${data.data.token}`
  authStorage.setToken(newToken)
  authStorage.setUser(data.data.user)

  return newToken
}

/**
 * Refresh token with queueing support
 * Ensures only one refresh request is in progress at a time
 */
export const refreshTokenWithQueue = async (): Promise<string> => {
  const authFromApps = authStorage.getAuthFromApps<{ token: string }>()
  if (!authFromApps?.token) {
    throw new Error('No refresh token available')
  }

  // Queue request if refresh already in progress
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      pendingRequests.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    // eslint-disable-next-line no-console
    console.log('[HTTP] Refreshing token')

    const newToken = await refreshToken(authFromApps.token)

    // eslint-disable-next-line no-console
    console.log('[HTTP] Token refreshed')

    processPendingRequests(null, newToken)
    return newToken
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[HTTP] Refresh failed:', error)

    processPendingRequests(error)
    authStorage.clearSession()
    throw error
  } finally {
    isRefreshing = false
  }
}
