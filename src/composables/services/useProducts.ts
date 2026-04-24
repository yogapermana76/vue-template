/**
 * Product Composables
 *
 * Langsung pakai TanStack Query - simple & straightforward.
 */

import { computed, ref, unref, type Ref } from 'vue'
import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/vue-query'
import {
  productService,
  type ProductFilters,
  type ProductPaginationParams,
} from '@/services/demo/product.service'
import { config } from '@/config'

// ============================================
// Query Keys
// ============================================

export const productKeys = {
  all: ['products'] as const,
  list: (filters?: ProductFilters, pagination?: ProductPaginationParams) =>
    [...productKeys.all, 'list', { filters, pagination }] as const,
  detail: (id: number) => [...productKeys.all, id] as const,
  categories: ['products', 'categories'] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Fetch products dengan filter & pagination
 */
export function useProducts(
  filters: Ref<ProductFilters> = ref({}),
  pagination: Ref<ProductPaginationParams> = ref({}),
) {
  return useQuery({
    queryKey: computed(() => productKeys.list(unref(filters), unref(pagination))),
    queryFn: () => productService.getAll(unref(filters), unref(pagination)),
    staleTime: config.cache.defaultStaleTime,
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch single product
 */
export function useProduct(id: Ref<number> | number) {
  const resolvedId = computed(() => unref(id))

  return useQuery({
    queryKey: computed(() => productKeys.detail(resolvedId.value)),
    queryFn: () => productService.getById(resolvedId.value),
    staleTime: config.cache.defaultStaleTime,
    enabled: computed(() => !!resolvedId.value),
  })
}

/**
 * Infinite scroll products
 */
export function useProductsInfinite(filters: Ref<ProductFilters> = ref({}), limit: number = 10) {
  return useInfiniteQuery({
    queryKey: computed(() => [...productKeys.all, 'infinite', unref(filters)]),
    queryFn: ({ pageParam }) => productService.getAll(unref(filters), { page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
    staleTime: config.cache.defaultStaleTime,
  })
}

/**
 * Fetch categories (cache lebih lama)
 */
export function useProductCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: productService.getCategories,
    staleTime: config.cache.longStaleTime,
  })
}
