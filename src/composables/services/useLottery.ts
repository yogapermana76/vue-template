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
import { useQuery, useMutation } from '@tanstack/vue-query'
import { lotteryService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type {
  UseLotteryRedeemablePagesParams,
  UseLotteryDetailParams,
  UseLotteryPromoParams,
  UseUserLotteryListParams,
  UseUserLotteryDetailParams,
  LotteryDetailResponse,
  LotteryRedeemRequest,
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

// ============================================
// Mutations
// ============================================

/**
 * Redeem lottery (exchange points for lottery entry)
 */
export function useLotteryRedeem() {
  return useMutation({
    mutationFn: (request: LotteryRedeemRequest) => lotteryService.redeem(request),
  })
}
