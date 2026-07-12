import { useMutation } from '@tanstack/vue-query'
import { authService } from '@/services'
import type { LoginRequest } from '@/types/services'

export const authKeys = {
  all: ['auth'] as const,
}

export function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),
  })
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
  })
}
