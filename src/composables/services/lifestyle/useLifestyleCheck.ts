/**
 * Lifestyle Check Composables
 * Using TanStack Query for check/validation operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { lifestyleCheckService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type { LifestyleCheckConditionParams } from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleCheckKeys = {
  all: ['lifestyle-check'] as const,
  health: () => [...lifestyleCheckKeys.all, 'health'] as const,
  condition: (params?: LifestyleCheckConditionParams) =>
    [...lifestyleCheckKeys.all, 'condition', params] as const,
  systemStatus: () => [...lifestyleCheckKeys.all, 'system-status'] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleCheckConditionParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number> }
>

// ============================================
// Queries
// ============================================

/**
 * Health check
 */
export function useLifestyleHealth(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleCheckKeys.health(),
    queryFn: () => lifestyleCheckService.health(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Check booking condition
 */
export function useLifestyleCheckCondition(params: UseLifestyleCheckConditionParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))

  const defaultEnabled = computed(() => !!resolvedProgramId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleCheckKeys.condition({ programId: resolvedProgramId.value! })),
    queryFn: () => lifestyleCheckService.checkCondition({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get system status
 */
export function useLifestyleSystemStatus(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleCheckKeys.systemStatus(),
    queryFn: () => lifestyleCheckService.getSystemStatus(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}
