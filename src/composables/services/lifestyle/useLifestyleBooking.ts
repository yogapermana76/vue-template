/**
 * Lifestyle Booking Composables
 * Using TanStack Query for booking operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { lifestyleBookingService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type { LifestyleCreateBookingRequest } from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleBookingKeys = {
  all: ['lifestyle-booking'] as const,
  status: (bookingId?: string) => [...lifestyleBookingKeys.all, 'status', bookingId] as const,
  detail: (bookingId?: string) => [...lifestyleBookingKeys.all, 'detail', bookingId] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleBookingStatusParams = BaseComposableParams<never, { bookingId?: MaybeRef<string> }>
type UseLifestyleBookingDetailParams = BaseComposableParams<never, { bookingId?: MaybeRef<string> }>

// ============================================
// Queries
// ============================================

/**
 * Check booking status
 */
export function useLifestyleBookingStatus(params: UseLifestyleBookingStatusParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { bookingId } = pathParams

  const resolvedBookingId = computed(() => unref(bookingId))

  const defaultEnabled = computed(() => !!resolvedBookingId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleBookingKeys.status(resolvedBookingId.value)),
    queryFn: () => lifestyleBookingService.checkStatus({ bookingId: resolvedBookingId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get booking detail
 */
export function useLifestyleBookingDetail(params: UseLifestyleBookingDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { bookingId } = pathParams

  const resolvedBookingId = computed(() => unref(bookingId))

  const defaultEnabled = computed(() => !!resolvedBookingId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleBookingKeys.detail(resolvedBookingId.value)),
    queryFn: () => lifestyleBookingService.getDetail(resolvedBookingId.value!),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Create a new booking
 */
export function useLifestyleCreateBooking(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LifestyleCreateBookingRequest) =>
      lifestyleBookingService.create(request, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestyleBookingKeys.all })
    },
  })
}
