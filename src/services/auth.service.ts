import { createHttpClient, http } from './http'
import { AuthEndpoint } from './endpoints'
import { config } from '@/config'
import type {
  SyncAccountRequest,
  LegacyAuthResponse,
  LoginBasicRequest,
  LoginBasicResponse,
  UserProfileResponse,
} from '@/types'

export const authService = {
  // Exchange PLN Mobile token for JWT
  async syncAccount(params: SyncAccountRequest): Promise<LegacyAuthResponse> {
    const plnmClient = createHttpClient(config.api.url.base, 'none')
    plnmClient.defaults.headers.common['Authorization'] = params.token

    const { data } = await plnmClient.post<LegacyAuthResponse>(AuthEndpoint.SYNC_ACCOUNT, {
      token: params.token,
    })
    return data
  },

  // Basic login with email/password
  async loginBasic(params: LoginBasicRequest): Promise<LoginBasicResponse> {
    const noAuthClient = createHttpClient(config.api.url.base, 'none')
    const { data } = await noAuthClient.post<LoginBasicResponse>(AuthEndpoint.LOGIN_BASIC, params)
    return data
  },

  // Get current user profile
  async getProfile(): Promise<UserProfileResponse> {
    const { data } = await http.get<UserProfileResponse>(AuthEndpoint.ME)
    return data
  },
}
