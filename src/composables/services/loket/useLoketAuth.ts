import { useMutation } from '@tanstack/vue-query'
import { loketAuthService } from '@/services/loket'
import type { LoketLoginRequest } from '@/types/services/loket'

export const loketAuthKeys = {
  all: ['loket-auth'] as const,
}

export function useLoketLogin() {
  return useMutation({
    mutationFn: (request: LoketLoginRequest) => loketAuthService.login(request),
  })
}

export function useLoketRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => loketAuthService.refreshToken(refreshToken),
  })
}
