/**
 * Lottery Composables
 * Using TanStack Query for lottery operations
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), options (query config)
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'
import { lotteryService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import { pointKeys } from './usePoint'
import type {
  UseLotteryRedeemablePagesParams,
  UseLotteryDetailParams,
  UseLotteryPromoParams,
  UseUserLotteryListParams,
  UseUserLotteryDetailParams,
  LotteryDetailResponse,
  LotteryRedeemRequest,
  UserLottery,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const lotteryKeys = {
  all: ['lottery'] as const,
  redeemablePages: (query?: { page?: number; size?: number }) =>
    [...lotteryKeys.all, 'redeemable-pages', query] as const,
  detail: (id?: string) => [...lotteryKeys.all, 'detail', id] as const,
  promo: (query?: { page?: number; size?: number }) =>
    [...lotteryKeys.all, 'promo', query] as const,
  userList: (query?: { page?: number; size?: number }) =>
    [...lotteryKeys.all, 'user-list', query] as const,
  userDetail: (id?: string) => [...lotteryKeys.all, 'user-detail', id] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Fetch redeemable lottery pages
 */
export function useLotteryRedeemablePages(params: UseLotteryRedeemablePagesParams = {}) {
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
      lotteryKeys.redeemablePages({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      lotteryService.redeemablePages({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Fetch lottery detail by ID
 */
export function useLotteryDetail(params: UseLotteryDetailParams = {}) {
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
    queryKey: computed(() => lotteryKeys.detail(resolvedId.value)),
    queryFn: async () => {
      const res = (await lotteryService.detail({ id: resolvedId.value! })) as LotteryDetailResponse
      return res.data
    },
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get lottery promo pages (user's eligible lotteries)
 */
export function useLotteryPromo(params: UseLotteryPromoParams = {}) {
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
      lotteryKeys.promo({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      lotteryService.promo({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get user lottery list (user's lottery history)
 */
export function useUserLotteryList(params: UseUserLotteryListParams = {}) {
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
      lotteryKeys.userList({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      lotteryService.userList({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get user lottery detail
 */
export function useUserLotteryDetail(params: UseUserLotteryDetailParams = {}) {
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
    queryKey: computed(() => lotteryKeys.userDetail(resolvedId.value)),
    queryFn: () => lotteryService.userDetail({ id: resolvedId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get user lottery list with infinite scroll pagination
 *
 * @example
 * // Basic usage with defaults
 * const { data } = useUserLotteryListInfinite()
 *
 * @example
 * // With custom size
 * const { data } = useUserLotteryListInfinite({
 *   query: { size: 20 }
 * })
 */
export function useUserLotteryListInfinite(params: UseUserLotteryListParams = {}) {
  const { query = {}, options = {} } = params
  const { size = 10 } = query

  const authStore = useAuthStore()

  const resolvedSize = computed(() => unref(size))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  const infiniteQuery = useInfiniteQuery({
    queryKey: computed(() =>
      lotteryKeys.userList({
        size: resolvedSize.value,
      }),
    ),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await lotteryService.userList({
        page: pageParam,
        size: resolvedSize.value,
      })

      const items: UserLottery[] = response.data?.data ?? []
      const total = response.data?.total ?? 0

      return {
        data: items,
        page: pageParam,
        total,
        hasMore: (pageParam + 1) * resolvedSize.value < total,
      }
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })

  // Extract total from first page
  const total = computed(() => infiniteQuery.data.value?.pages?.[0]?.total ?? 0)

  return {
    ...infiniteQuery,
    total,
  }
}

// ============================================
// Mutations
// ============================================

/**
 * Redeem lottery (exchange points for lottery entry)
 *
 * @example Default usage (with error toast)
 * ```ts
 * const { mutateAsync: redeem } = useLotteryRedeem()
 * await redeem({ lotteryId: '123', quantity: 1 })
 * ```
 *
 * @example Silent mode (without error toast)
 * ```ts
 * const { mutateAsync: redeem } = useLotteryRedeem({ showErrorToast: false })
 * await redeem({ lotteryId: '123', quantity: 1 })
 * ```
 */
export function useLotteryRedeem(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LotteryRedeemRequest) => lotteryService.redeem(request, options),
    onSuccess: () => {
      // Invalidate point summary to refetch updated balance
      queryClient.invalidateQueries({ queryKey: pointKeys.summary() })
      // Invalidate user lottery list to reflect new redemption
      queryClient.invalidateQueries({ queryKey: lotteryKeys.userList() })
    },
  })
}
