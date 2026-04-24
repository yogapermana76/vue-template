/**
 * Lifestyle Queue Composables
 * Using TanStack Query for queue operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { lifestyleQueueService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type { LifestyleJoinQueueRequest, LifestyleCancelQueueRequest } from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleQueueKeys = {
  all: ['lifestyle-queue'] as const,
  info: (queueId?: string) => [...lifestyleQueueKeys.all, 'info', queueId] as const,
  status: (programId?: number, visitDate?: string) =>
    [...lifestyleQueueKeys.all, 'status', programId, visitDate] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleQueueInfoParams = BaseComposableParams<never, { queueId?: MaybeRef<string> }>
type UseLifestyleQueueStatusParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number>; visitDate?: MaybeRef<string> }
>

// ============================================
// Queries
// ============================================

/**
 * Get queue info
 */
export function useLifestyleQueueInfo(params: UseLifestyleQueueInfoParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { queueId } = pathParams

  const resolvedQueueId = computed(() => unref(queueId))

  const defaultEnabled = computed(() => !!resolvedQueueId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleQueueKeys.info(resolvedQueueId.value)),
    queryFn: () => lifestyleQueueService.getInfo({ queueId: resolvedQueueId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get queue status
 */
export function useLifestyleQueueStatus(params: UseLifestyleQueueStatusParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId, visitDate } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedVisitDate = computed(() => unref(visitDate))

  const defaultEnabled = computed(() => !!resolvedProgramId.value && !!resolvedVisitDate.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      lifestyleQueueKeys.status(resolvedProgramId.value, resolvedVisitDate.value),
    ),
    queryFn: () =>
      lifestyleQueueService.getStatus({
        programId: resolvedProgramId.value!,
        visitDate: resolvedVisitDate.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Join queue
 */
export function useLifestyleJoinQueue(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LifestyleJoinQueueRequest) =>
      lifestyleQueueService.join(request, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestyleQueueKeys.all })
    },
  })
}

/**
 * Cancel queue
 */
export function useLifestyleCancelQueue(options?: { showErrorToast?: boolean }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LifestyleCancelQueueRequest) =>
      lifestyleQueueService.cancel(request, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestyleQueueKeys.all })
    },
  })
}
