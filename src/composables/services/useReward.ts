/**
 * Reward Composables
 * Using TanStack Query for reward operations
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), options (query config)
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { rewardService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type {
  UseRewardGiftInstantlyParams,
  UseRewardRedeemableParams,
  UseRewardRedeemableDetailParams,
  UseRewardGiftInstantlyDetailParams,
  UseUserGiftInstantlyParams,
  UseUserGiftInstantlyDetailParams,
  UseExchangePointDetailParams,
  UseVerifyInfoParams,
  ExchangeRequest,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const rewardKeys = {
  all: ['reward'] as const,
  giftInstantly: (query?: { page?: number; size?: number }) =>
    [...rewardKeys.all, 'gift-instantly', query] as const,
  redeemable: (query?: { page?: number; size?: number }) =>
    [...rewardKeys.all, 'redeemable', query] as const,
  redeemableDetail: (id?: string) => [...rewardKeys.all, 'redeemable-detail', id] as const,
  giftInstantlyDetail: (id?: string) => [...rewardKeys.all, 'gift-instantly-detail', id] as const,
  userGiftInstantly: (query?: { page?: number; size?: number }) =>
    [...rewardKeys.all, 'user-gift-instantly', query] as const,
  userGiftInstantlyDetail: (id?: string) =>
    [...rewardKeys.all, 'user-gift-instantly-detail', id] as const,
  lastAddress: () => [...rewardKeys.all, 'last-address'] as const,
  categories: () => [...rewardKeys.all, 'categories'] as const,
  exchangePointDetail: (tUserPointId?: string | number) =>
    [...rewardKeys.all, 'exchange-point-detail', tUserPointId] as const,
  verifyInfo: () => [...rewardKeys.all, 'verify-info'] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Get available gift instantly rewards
 */
export function useRewardGiftInstantly(params: UseRewardGiftInstantlyParams = {}) {
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
      rewardKeys.giftInstantly({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      rewardService.giftInstantly({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get redeemable rewards
 */
export function useRewardRedeemable(params: UseRewardRedeemableParams = {}) {
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
      rewardKeys.redeemable({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      rewardService.redeemable({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get redeemable reward detail
 */
export function useRewardRedeemableDetail(params: UseRewardRedeemableDetailParams = {}) {
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
    queryKey: computed(() => rewardKeys.redeemableDetail(resolvedId.value)),
    queryFn: () => rewardService.redeemableDetail({ id: resolvedId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get gift instantly detail
 */
export function useRewardGiftInstantlyDetail(params: UseRewardGiftInstantlyDetailParams = {}) {
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
    queryKey: computed(() => rewardKeys.giftInstantlyDetail(resolvedId.value)),
    queryFn: () => rewardService.giftInstantlyDetail({ id: resolvedId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get user's gift instantly rewards
 */
export function useUserGiftInstantly(params: UseUserGiftInstantlyParams = {}) {
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
      rewardKeys.userGiftInstantly({ page: resolvedPage.value, size: resolvedSize.value }),
    ),
    queryFn: () =>
      rewardService.userGiftInstantly({
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get user's gift instantly detail
 */
export function useUserGiftInstantlyDetail(params: UseUserGiftInstantlyDetailParams = {}) {
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
    queryKey: computed(() => rewardKeys.userGiftInstantlyDetail(resolvedId.value)),
    queryFn: () => rewardService.userGiftInstantlyDetail({ id: resolvedId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get last used address
 */
export function useLastAddress() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: rewardKeys.lastAddress(),
    queryFn: () => rewardService.lastAddress(),
    staleTime: config.cache.defaultStaleTime,
    enabled: computed(() => authStore.isAuthenticated),
  })
}

/**
 * Get reward categories
 */
export function useRewardCategories() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: rewardKeys.categories(),
    queryFn: () => rewardService.categories(),
    staleTime: config.cache.defaultStaleTime,
    enabled: computed(() => authStore.isAuthenticated),
  })
}

/**
 * Get exchange point detail
 */
export function useExchangePointDetail(params: UseExchangePointDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { tUserPointId } = pathParams

  const authStore = useAuthStore()
  const resolvedTUserPointId = computed(() => unref(tUserPointId))

  const defaultEnabled = computed(() => authStore.isAuthenticated && !!resolvedTUserPointId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => rewardKeys.exchangePointDetail(resolvedTUserPointId.value)),
    queryFn: () => rewardService.exchangePointDetail({ tUserPointId: resolvedTUserPointId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get verify info
 */
export function useVerifyInfo(params: UseVerifyInfoParams = {}) {
  const { options = {} } = params

  const authStore = useAuthStore()

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: rewardKeys.verifyInfo(),
    queryFn: () => rewardService.verifyInfo(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Exchange points for reward
 *
 * @example Default usage (with error toast)
 * ```ts
 * const { mutateAsync: exchange } = useRewardExchange()
 * await exchange({ rewardId: '123', quantity: 1 })
 * ```
 *
 * @example Silent mode (without error toast)
 * ```ts
 * const { mutateAsync: exchange } = useRewardExchange({ showErrorToast: false })
 * await exchange({ rewardId: '123', quantity: 1 })
 * ```
 */
export function useRewardExchange(options?: { showErrorToast?: boolean }) {
  return useMutation({
    mutationFn: (request: ExchangeRequest) => rewardService.exchange(request, options),
  })
}
