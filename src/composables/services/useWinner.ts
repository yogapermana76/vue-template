/**
 * Winner Composables
 * Using TanStack Query for winner operations
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), options (query config)
 */

import { computed, unref } from 'vue'
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query'
import { winnerService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type {
  UseWinnerListParams,
  UseWinnerListInfiniteParams,
  UseWinnerCategoriesParams,
  UseWinnerTncParams,
  WinnersResponse,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const winnerKeys = {
  all: ['winner'] as const,
  list: (query?: {
    page?: number
    size?: number
    timingCategory?: string
    lotteryId?: string | number
  }) => [...winnerKeys.all, 'list', query] as const,
  listInfinite: (query?: { timingCategory?: string; lotteryId?: string | number }) =>
    [...winnerKeys.all, 'list-infinite', query] as const,
  categories: (query?: { lotteryId?: string | number }) =>
    [...winnerKeys.all, 'categories', query] as const,
  tnc: (query?: { lotteryId?: string | number }) => [...winnerKeys.all, 'tnc', query] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Get winners list with pagination
 */
export function useWinnerList(params: UseWinnerListParams = {}) {
  const { query = {}, options = {} } = params
  const { page = 0, size = 10, timingCategory, lotteryId } = query

  const authStore = useAuthStore()

  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))
  const resolvedTimingCategory = computed(() => unref(timingCategory))
  const resolvedLotteryId = computed(() => unref(lotteryId))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      winnerKeys.list({
        page: resolvedPage.value,
        size: resolvedSize.value,
        timingCategory: resolvedTimingCategory.value,
        lotteryId: resolvedLotteryId.value,
      }),
    ),
    queryFn: () =>
      winnerService.list({
        page: resolvedPage.value,
        size: resolvedSize.value,
        timingCategory: resolvedTimingCategory.value,
        lotteryId: resolvedLotteryId.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Infinite scroll winners list
 */
export function useWinnerListInfinite(params: UseWinnerListInfiniteParams = {}) {
  const { query = {}, options = {} } = params
  const { size = 10, timingCategory, lotteryId } = query

  const authStore = useAuthStore()

  const resolvedSize = typeof size === 'number' ? size : 10
  const resolvedTimingCategory = computed(() => unref(timingCategory))
  const resolvedLotteryId = computed(() => unref(lotteryId))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useInfiniteQuery({
    queryKey: computed(() =>
      winnerKeys.listInfinite({
        timingCategory: resolvedTimingCategory.value,
        lotteryId: resolvedLotteryId.value,
      }),
    ),
    queryFn: async ({ pageParam }) => {
      const res = (await winnerService.list({
        page: pageParam,
        size: resolvedSize,
        timingCategory: resolvedTimingCategory.value,
        lotteryId: resolvedLotteryId.value,
      })) as WinnersResponse

      const items = res.data?.data || []

      return {
        data: items,
        detailUserWinner: res.data?.detailUserWinner || null,
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
 * Get winner categories
 */
export function useWinnerCategories(params: UseWinnerCategoriesParams = {}) {
  const { query = {}, options = {} } = params
  const { lotteryId } = query

  const authStore = useAuthStore()
  const resolvedLotteryId = computed(() => unref(lotteryId))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => winnerKeys.categories({ lotteryId: resolvedLotteryId.value })),
    queryFn: () =>
      winnerService.categories(
        resolvedLotteryId.value ? { lotteryId: resolvedLotteryId.value } : undefined,
      ),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get winner terms & conditions
 */
export function useWinnerTnc(params: UseWinnerTncParams = {}) {
  const { query = {}, options = {} } = params
  const { lotteryId } = query

  const resolvedLotteryId = computed(() => unref(lotteryId))

  return useQuery({
    queryKey: computed(() => winnerKeys.tnc({ lotteryId: resolvedLotteryId.value })),
    queryFn: () =>
      winnerService.tnc(
        resolvedLotteryId.value ? { lotteryId: resolvedLotteryId.value } : undefined,
      ),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: options.enabled !== undefined ? computed(() => unref(options.enabled)) : undefined,
  })
}
