import { publicHttp } from './http'
import { AuthEndpoint } from './endpoints'
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/services'

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await publicHttp.post<LoginResponse>(AuthEndpoint.LOGIN, request)
    return data
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await publicHttp.post<RefreshTokenResponse>(AuthEndpoint.REFRESH, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    return data
  },
}
