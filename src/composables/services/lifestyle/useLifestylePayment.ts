/**
 * Lifestyle Payment Composables
 * Using TanStack Query for payment operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { lifestylePaymentService } from '@/services/lifestyle'
import { config } from '@/config'
import { lifestyleBookingKeys } from './useLifestyleBooking'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type { LifestyleCreatePaymentRequest } from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestylePaymentKeys = {
  all: ['lifestyle-payment'] as const,
  methods: () => [...lifestylePaymentKeys.all, 'methods'] as const,
  status: (paymentId?: string) => [...lifestylePaymentKeys.all, 'status', paymentId] as const,
  detail: (paymentId?: string) => [...lifestylePaymentKeys.all, 'detail', paymentId] as const,
  instruction: (paymentMethodCode?: string) =>
    [...lifestylePaymentKeys.all, 'instruction', paymentMethodCode] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestylePaymentStatusParams = BaseComposableParams<never, { paymentId?: MaybeRef<string> }>
type UseLifestylePaymentDetailParams = BaseComposableParams<never, { paymentId?: MaybeRef<string> }>
type UseLifestylePaymentInstructionParams = BaseComposableParams<
  never,
  { paymentMethodCode?: MaybeRef<string> }
>

// ============================================
// Queries
// ============================================

/**
 * Get available payment methods
 */
export function useLifestylePaymentMethods(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestylePaymentKeys.methods(),
    queryFn: () => lifestylePaymentService.getPaymentMethods(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Check payment status
 */
export function useLifestylePaymentStatus(params: UseLifestylePaymentStatusParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { paymentId } = pathParams

  const resolvedPaymentId = computed(() => unref(paymentId))

  const defaultEnabled = computed(() => !!resolvedPaymentId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestylePaymentKeys.status(resolvedPaymentId.value)),
    queryFn: () => lifestylePaymentService.checkStatus({ paymentId: resolvedPaymentId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get payment detail
 */
export function useLifestylePaymentDetail(params: UseLifestylePaymentDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { paymentId } = pathParams

  const resolvedPaymentId = computed(() => unref(paymentId))

  const defaultEnabled = computed(() => !!resolvedPaymentId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestylePaymentKeys.detail(resolvedPaymentId.value)),
    queryFn: () => lifestylePaymentService.getDetail(resolvedPaymentId.value!),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get payment instruction
 */
export function useLifestylePaymentInstruction(params: UseLifestylePaymentInstructionParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { paymentMethodCode } = pathParams

  const resolvedPaymentMethodCode = computed(() => unref(paymentMethodCode))

  const defaultEnabled = computed(() => !!resolvedPaymentMethodCode.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestylePaymentKeys.instruction(resolvedPaymentMethodCode.value)),
    queryFn: () =>
      lifestylePaymentService.getInstruction({
        paymentMethodCode: resolvedPaymentMethodCode.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Create a new payment
 */
export function useLifestyleCreatePayment(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LifestyleCreatePaymentRequest) =>
      lifestylePaymentService.create(request, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestylePaymentKeys.all })
      queryClient.invalidateQueries({ queryKey: lifestyleBookingKeys.all })
    },
  })
}

/**
 * Cancel payment
 */
export function useLifestyleCancelPayment(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentId: string) => lifestylePaymentService.cancel(paymentId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestylePaymentKeys.all })
    },
  })
}
