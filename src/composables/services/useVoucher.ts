/**
 * Voucher Composables
 * Using TanStack Query for voucher operations
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), body (request), options (query config)
 * - All parameter groups are optional
 */

import { computed, unref } from 'vue'
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query'
import { voucherService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type {
  UseVoucherPagesParams,
  UseVoucherDetailParams,
  UseVoucherCategoriesParams,
  Voucher,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const voucherKeys = {
  all: ['voucher'] as const,
  pages: (query?: { page?: number; size?: number; categoryId?: number }) =>
    [...voucherKeys.all, 'pages', query] as const,
  detail: (voucherCodeAndId?: string) => [...voucherKeys.all, 'detail', voucherCodeAndId] as const,
  categories: () => [...voucherKeys.all, 'categories'] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Get user vouchers with pagination
 *
 * @example
 * // Basic usage with defaults
 * const { data } = useVoucherPages()
 *
 * @example
 * // With reactive pagination
 * const page = ref(0)
 * const { data } = useVoucherPages({
 *   query: { page, size: 20 }
 * })
 *
 * @example
 * // With category filter and options override
 * const categoryId = ref<number | undefined>(1)
 * const { data } = useVoucherPages({
 *   query: { page: 0, size: 10, categoryId },
 *   options: { staleTime: 1000 * 60 * 5 }
 * })
 */
export function useVoucherPages(params: UseVoucherPagesParams = {}) {
  const { query = {}, options = {} } = params
  const { page = 0, size = 10, categoryId } = query

  const authStore = useAuthStore()

  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))
  const resolvedCategoryId = computed(() => unref(categoryId))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      voucherKeys.pages({
        page: resolvedPage.value,
        size: resolvedSize.value,
        categoryId: resolvedCategoryId.value,
      }),
    ),
    queryFn: () =>
      voucherService.pages({
        page: resolvedPage.value,
        size: resolvedSize.value,
        categoryId: resolvedCategoryId.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get voucher detail by code and ID
 *
 * @example
 * // Static parameters
 * const { data } = useVoucherDetail({ params: { voucherCode: 'LVXH9KNMDVO6', voucherId: '434' } })
 *
 * @example
 * // Reactive parameters (from route) with options
 * const route = useRoute()
 * const voucherCode = computed(() => route.params.code as string)
 * const voucherId = computed(() => route.params.id as string)
 * const { data } = useVoucherDetail({
 *   params: { voucherCode, voucherId },
 *   options: { enabled: isReady }
 * })
 */
export function useVoucherDetail(params: UseVoucherDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { voucherCode, voucherId } = pathParams

  const authStore = useAuthStore()
  const resolvedCode = computed(() => unref(voucherCode))
  const resolvedId = computed(() => unref(voucherId))

  const defaultEnabled = computed(
    () => authStore.isAuthenticated && !!resolvedCode.value && !!resolvedId.value,
  )
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => voucherKeys.detail(`${resolvedCode.value}-${resolvedId.value}`)),
    queryFn: () =>
      voucherService.detail({
        voucherCode: resolvedCode.value!,
        voucherId: String(resolvedId.value!),
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get voucher categories
 *
 * @example
 * const { data: categories } = useVoucherCategories()
 *
 * @example
 * // With enabled option
 * const { data: categories } = useVoucherCategories({
 *   options: { enabled: computed(() => isActive.value) }
 * })
 */
export function useVoucherCategories(params: UseVoucherCategoriesParams = {}) {
  const { options = {} } = params
  const authStore = useAuthStore()

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: voucherKeys.categories(),
    queryFn: () => voucherService.categories(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get user vouchers with infinite scroll pagination
 *
 * @example
 * // Basic usage with defaults
 * const { data } = useVoucherPagesInfinite()
 *
 * @example
 * // With category filter
 * const categoryId = ref<number | undefined>(1)
 * const { data } = useVoucherPagesInfinite({
 *   query: { size: 20, categoryId }
 * })
 */
export function useVoucherPagesInfinite(params: UseVoucherPagesParams = {}) {
  const { query = {}, options = {} } = params
  const { size = 10, categoryId } = query

  const authStore = useAuthStore()

  const resolvedSize = computed(() => unref(size))
  const resolvedCategoryId = computed(() => unref(categoryId))

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useInfiniteQuery({
    queryKey: computed(() =>
      voucherKeys.pages({
        size: resolvedSize.value,
        categoryId: resolvedCategoryId.value,
      }),
    ),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await voucherService.pages({
        page: pageParam,
        size: resolvedSize.value,
        categoryId: resolvedCategoryId.value,
      })

      const items: Voucher[] = response.data?.data ?? []
      const total = response.data?.total ?? 0

      return {
        data: items,
        page: pageParam,
        hasMore: (pageParam + 1) * resolvedSize.value < total,
      }
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}
