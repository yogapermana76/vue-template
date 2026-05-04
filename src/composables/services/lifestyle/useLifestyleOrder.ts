/**
 * Lifestyle Order Composables
 * Using TanStack Query for order operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { lifestyleOrderService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type { LifestyleGetOrderHistoryParams, LifestyleCancelOrderRequest } from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleOrderKeys = {
  all: ['lifestyle-order'] as const,
  history: (query?: Partial<LifestyleGetOrderHistoryParams>) =>
    [...lifestyleOrderKeys.all, 'history', query] as const,
  detail: (orderId?: string) => [...lifestyleOrderKeys.all, 'detail', orderId] as const,
  invoice: (orderId?: string) => [...lifestyleOrderKeys.all, 'invoice', orderId] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleOrderHistoryParams = BaseComposableParams<
  Omit<LifestyleGetOrderHistoryParams, 'page' | 'size'>
>
type UseLifestyleOrderDetailParams = BaseComposableParams<never, { orderId?: MaybeRef<string> }>
type UseLifestyleOrderInvoiceParams = BaseComposableParams<never, { orderId?: MaybeRef<string> }>

// ============================================
// Queries
// ============================================

/**
 * Get order history
 */
export function useLifestyleOrderHistory(params: UseLifestyleOrderHistoryParams = {}) {
  const { query = {}, options = {} } = params

  const resolvedQuery = computed(() => ({
    status: unref(query.status),
    startDate: unref(query.startDate),
    endDate: unref(query.endDate),
    page: unref(query.page),
    size: unref(query.size),
  }))

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: computed(() => lifestyleOrderKeys.history(resolvedQuery.value)),
    queryFn: () => lifestyleOrderService.getHistory(resolvedQuery.value),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get order detail
 */
export function useLifestyleOrderDetail(params: UseLifestyleOrderDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { orderId } = pathParams

  const resolvedOrderId = computed(() => unref(orderId))

  const defaultEnabled = computed(() => !!resolvedOrderId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleOrderKeys.detail(resolvedOrderId.value)),
    queryFn: () => lifestyleOrderService.getDetail({ orderId: resolvedOrderId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get invoice
 */
export function useLifestyleOrderInvoice(params: UseLifestyleOrderInvoiceParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { orderId } = pathParams

  const resolvedOrderId = computed(() => unref(orderId))

  const defaultEnabled = computed(() => !!resolvedOrderId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleOrderKeys.invoice(resolvedOrderId.value)),
    queryFn: () => lifestyleOrderService.getInvoice({ orderId: resolvedOrderId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Cancel order
 */
export function useLifestyleCancelOrder(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LifestyleCancelOrderRequest) =>
      lifestyleOrderService.cancel(request, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestyleOrderKeys.all })
    },
  })
}

/**
 * Download invoice
 */
export function useLifestyleDownloadInvoice() {
  return useMutation({
    mutationFn: (orderId: string) => lifestyleOrderService.downloadInvoice(orderId),
  })
}
