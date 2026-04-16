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
import { useQuery } from '@tanstack/vue-query'
import { voucherService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type { UseVoucherPagesParams, UseVoucherDetailParams } from '@/types'

// ============================================
// Query Keys
// ============================================

export const voucherKeys = {
  all: ['voucher'] as const,
  pages: (query?: { page?: number; size?: number; categoryId?: number }) =>
    [...voucherKeys.all, 'pages', query] as const,
  detail: (id?: string) => [...voucherKeys.all, 'detail', id] as const,
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
 * Get voucher detail by ID
 *
 * @example
 * // Static ID
 * const { data } = useVoucherDetail({ params: { id: '123' } })
 *
 * @example
 * // Reactive ID (from route) with options
 * const route = useRoute()
 * const id = computed(() => route.params.id as string)
 * const { data } = useVoucherDetail({
 *   params: { id },
 *   options: { enabled: isReady }
 * })
 */
export function useVoucherDetail(params: UseVoucherDetailParams = {}) {
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
    queryKey: computed(() => voucherKeys.detail(resolvedId.value)),
    queryFn: () => voucherService.detail({ id: resolvedId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get voucher categories
 *
 * @example
 * const { data: categories } = useVoucherCategories()
 */
export function useVoucherCategories() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: voucherKeys.categories(),
    queryFn: () => voucherService.categories(),
    staleTime: config.cache.defaultStaleTime,
    enabled: computed(() => authStore.isAuthenticated),
  })
}
