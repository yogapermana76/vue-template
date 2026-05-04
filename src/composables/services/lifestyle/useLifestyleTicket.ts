/**
 * Lifestyle Ticket Composables
 * Using TanStack Query for ticket operations (My Ticket) in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { lifestyleTicketService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type { LifestyleGetMyTicketsParams } from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleTicketKeys = {
  all: ['lifestyle-ticket'] as const,
  myTickets: (query?: Partial<LifestyleGetMyTicketsParams>) =>
    [...lifestyleTicketKeys.all, 'my-tickets', query] as const,
  detail: (ticketId?: string) => [...lifestyleTicketKeys.all, 'detail', ticketId] as const,
  byOrder: (orderId?: string) => [...lifestyleTicketKeys.all, 'by-order', orderId] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleMyTicketsParams = BaseComposableParams<
  Omit<LifestyleGetMyTicketsParams, 'page' | 'size'>
>
type UseLifestyleTicketDetailParams = BaseComposableParams<never, { ticketId?: MaybeRef<string> }>
type UseLifestyleTicketByOrderParams = BaseComposableParams<never, { orderId?: MaybeRef<string> }>

// ============================================
// Queries
// ============================================

/**
 * Get my tickets
 */
export function useLifestyleMyTickets(params: UseLifestyleMyTicketsParams = {}) {
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
    queryKey: computed(() => lifestyleTicketKeys.myTickets(resolvedQuery.value)),
    queryFn: () => lifestyleTicketService.getMyTickets(resolvedQuery.value),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get ticket detail
 */
export function useLifestyleTicketDetail(params: UseLifestyleTicketDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { ticketId } = pathParams

  const resolvedTicketId = computed(() => unref(ticketId))

  const defaultEnabled = computed(() => !!resolvedTicketId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleTicketKeys.detail(resolvedTicketId.value)),
    queryFn: () => lifestyleTicketService.getDetail({ ticketId: resolvedTicketId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get tickets by order ID
 */
export function useLifestyleTicketByOrder(params: UseLifestyleTicketByOrderParams = {}) {
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
    queryKey: computed(() => lifestyleTicketKeys.byOrder(resolvedOrderId.value)),
    queryFn: () => lifestyleTicketService.getByOrder({ orderId: resolvedOrderId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Download e-ticket
 */
export function useLifestyleDownloadETicket() {
  return useMutation({
    mutationFn: (ticketId: string) => lifestyleTicketService.downloadETicket({ ticketId }),
  })
}
