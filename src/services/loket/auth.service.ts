import { loketPublicHttp } from '../http'
import { LoketAuthEndpoint } from './endpoints'
import type {
  LoketLoginRequest,
  LoketLoginResponse,
  LoketRefreshTokenResponse,
} from '@/types/services/loket'

export const loketAuthService = {
  async login(request: LoketLoginRequest): Promise<LoketLoginResponse> {
    const { data } = await loketPublicHttp.post<LoketLoginResponse>(
      LoketAuthEndpoint.LOGIN,
      request,
    )
    return data
  },

  async refreshToken(refreshToken: string): Promise<LoketRefreshTokenResponse> {
    const { data } = await loketPublicHttp.post<LoketRefreshTokenResponse>(
      LoketAuthEndpoint.REFRESH,
      null,
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    )
    return data
  },
}
