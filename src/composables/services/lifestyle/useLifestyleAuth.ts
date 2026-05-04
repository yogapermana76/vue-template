/**
 * Lifestyle Auth Composables
 * Using TanStack Query for authentication operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { lifestyleAuthService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams } from '@/types/common/base.types'
import type {
  LifestyleLoginBasicRequest,
  LifestyleValidateSecurityCodeRequest,
  LifestyleSemiLoginRequest,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleAuthKeys = {
  all: ['lifestyle-auth'] as const,
  profile: () => [...lifestyleAuthKeys.all, 'profile'] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleProfileParams = BaseComposableParams

// ============================================
// Queries
// ============================================

/**
 * Get current user profile from Lifestyle API
 */
export function useLifestyleProfile(params: UseLifestyleProfileParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleAuthKeys.profile(),
    queryFn: () => lifestyleAuthService.getProfile(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Login with email and password
 */
export function useLifestyleLoginBasic() {
  return useMutation({
    mutationFn: (request: LifestyleLoginBasicRequest) => lifestyleAuthService.loginBasic(request),
  })
}

/**
 * Validate security code
 */
export function useLifestyleValidateSecurityCode() {
  return useMutation({
    mutationFn: (request: LifestyleValidateSecurityCodeRequest) =>
      lifestyleAuthService.validateSecurityCode(request),
  })
}

/**
 * Semi login with refresh token
 */
export function useLifestyleSemiLogin() {
  return useMutation({
    mutationFn: (request: LifestyleSemiLoginRequest) => lifestyleAuthService.semiLogin(request),
  })
}
