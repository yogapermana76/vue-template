/**
 * Public Data Composables
 * Using TanStack Query for public data (no auth required)
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), options (query config)
 */

import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { publicService } from '@/services'
import { config } from '@/config'
import type {
  UseFYIParams,
  UseFAQParams,
  UseWinnersCategoryParams,
  UsePublicWinnerTncParams,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const publicKeys = {
  all: ['public'] as const,
  fyi: () => [...publicKeys.all, 'fyi'] as const,
  faq: () => [...publicKeys.all, 'faq'] as const,
  category: (query?: { page?: number; size?: number }) =>
    [...publicKeys.all, 'category', query] as const,
  winnerTnc: () => [...publicKeys.all, 'winner-tnc'] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Fetch FYI (For Your Info)
 */
export function useFYI(params: UseFYIParams = {}) {
  const { options = {} } = params

  return useQuery({
    queryKey: publicKeys.fyi(),
    queryFn: () => publicService.fyi(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: options.enabled !== undefined ? computed(() => unref(options.enabled)) : undefined,
  })
}

/**
 * Fetch FAQ (Frequently Asked Questions)
 */
export function useFAQ(params: UseFAQParams = {}) {
  const { options = {} } = params

  return useQuery({
    queryKey: publicKeys.faq(),
    queryFn: () => publicService.faq(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: options.enabled !== undefined ? computed(() => unref(options.enabled)) : undefined,
  })
}

/**
 * Fetch Winners Category
 */
export function useWinnersCategory(params: UseWinnersCategoryParams = {}) {
  const { query = {}, options = {} } = params
  const { page = 0, size = 10 } = query

  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))

  return useQuery({
    queryKey: computed(() =>
      publicKeys.category({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      publicService.category({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: options.enabled !== undefined ? computed(() => unref(options.enabled)) : undefined,
  })
}

/**
 * Fetch Winner TnC (Terms and Conditions) - Public endpoint
 */
export function usePublicWinnerTnc(params: UsePublicWinnerTncParams = {}) {
  const { options = {} } = params

  return useQuery({
    queryKey: publicKeys.winnerTnc(),
    queryFn: () => publicService.winnerTnc(),
    staleTime: options.staleTime ?? config.cache.longStaleTime, // Cache longer for TnC
    enabled: options.enabled !== undefined ? computed(() => unref(options.enabled)) : undefined,
  })
}
