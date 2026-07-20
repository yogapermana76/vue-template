import { publicHttp } from './http'
import type { HttpConfig } from './http'
import { AuthEndpoint } from './endpoints'
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/services'

const SILENT: HttpConfig = { showSuccessToast: false, showErrorToast: false }

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await publicHttp.post<LoginResponse>(AuthEndpoint.LOGIN, request, SILENT)
    return data
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await publicHttp.post<RefreshTokenResponse>(AuthEndpoint.REFRESH, null, {
      ...SILENT,
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    return data
  },
}
