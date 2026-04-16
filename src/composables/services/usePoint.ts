/**
 * Point Composables
 * Using TanStack Query for point/coin operations
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), options (query config)
 */

import { computed, unref } from 'vue'
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query'
import { pointService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type {
  UsePointSummaryParams,
  UsePointHistoryParams,
  UsePointHistoryInfiniteParams,
  UsePointDetailParams,
  PointHistoryResponse,
  PointDetailResponse,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const pointKeys = {
  all: ['point'] as const,
  summary: () => [...pointKeys.all, 'summary'] as const,
  history: (query?: { page?: number; size?: number }) =>
    [...pointKeys.all, 'history', query] as const,
  historyInfinite: () => [...pointKeys.all, 'history-infinite'] as const,
  detail: (id?: string) => [...pointKeys.all, 'detail', id] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Get point summary (balance and expiry)
 */
export function usePointSummary(params: UsePointSummaryParams = {}) {
  const { options = {} } = params

  const authStore = useAuthStore()

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: pointKeys.summary(),
    queryFn: () => pointService.summary(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get point history with pagination
 */
export function usePointHistory(params: UsePointHistoryParams = {}) {
  const { query = {}, options = {} } = params
  const { page = 0, size = 10 } = query

  const authStore = useAuthStore()

  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      pointKeys.history({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      pointService.history({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Infinite scroll point history
 */
export function usePointHistoryInfinite(params: UsePointHistoryInfiniteParams = {}) {
  const { query = {}, options = {} } = params
  const { size = 10 } = query

  const authStore = useAuthStore()
  const resolvedSize = typeof size === 'number' ? size : 10

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useInfiniteQuery({
    queryKey: pointKeys.historyInfinite(),
    queryFn: async ({ pageParam }) => {
      const res = (await pointService.history({
        page: pageParam,
        size: resolvedSize,
      })) as PointHistoryResponse

      const items = res.data?.data || []

      return {
        data: items,
        page: pageParam,
        hasMore: items.length >= resolvedSize,
      }
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get point transaction detail
 */
export function usePointDetail(params: UsePointDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { id } = pathParams

  const authStore = useAuthStore()
  const resolvedId = computed(() => unref(id))

  const defaultEnabled = computed(() => authStore.isAuthenticated && !!resolvedId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => pointKeys.detail(resolvedId.value)),
    queryFn: async () => {
      const res = (await pointService.detail({ id: resolvedId.value! })) as PointDetailResponse
      return res.data
    },
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}
