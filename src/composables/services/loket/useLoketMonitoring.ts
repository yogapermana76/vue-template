/**
 * Loket Monitoring Composables
 * Using TanStack Query for ticket monitoring operations in the Loket module
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { loketMonitoringService } from '@/services/loket'
import { config } from '@/config'
import type { UseLoketMonitoringParams, LoketMonitoringParams } from '@/types/services/loket'

// ============================================
// Query Keys
// ============================================

export const loketMonitoringKeys = {
  all: ['loket-monitoring'] as const,
  /**
   * Include *every* filter dep — TanStack Query only refetches when the
   * key changes, so missing deps (e.g. date ranges) previously left the
   * query stuck on stale data after applying the advanced filter.
   */
  list: (
    programId?: number,
    query?: {
      page?: number
      size?: number
      Keyword?: string
      Claimed?: boolean
      OrderStartDate?: string
      OrderEndDate?: string
      ClaimedStartDate?: string
      ClaimedEndDate?: string
    },
  ) => [...loketMonitoringKeys.all, programId, query] as const,
}

// ============================================
// Queries
// ============================================

export function useLoketMonitoring(params: UseLoketMonitoringParams = {}) {
  const { query = {}, params: pathParams = {}, options = {} } = params
  const {
    page,
    size,
    Keyword,
    OrderStartDate,
    OrderEndDate,
    Claimed,
    ClaimedStartDate,
    ClaimedEndDate,
  } = query
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))
  const resolvedKeyword = computed(() => unref(Keyword))
  const resolvedOrderStartDate = computed(() => unref(OrderStartDate))
  const resolvedOrderEndDate = computed(() => unref(OrderEndDate))
  const resolvedClaimed = computed(() => unref(Claimed))
  const resolvedClaimedStartDate = computed(() => unref(ClaimedStartDate))
  const resolvedClaimedEndDate = computed(() => unref(ClaimedEndDate))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() =>
      loketMonitoringKeys.list(resolvedProgramId.value, {
        page: resolvedPage.value,
        size: resolvedSize.value,
        Keyword: resolvedKeyword.value,
        Claimed: resolvedClaimed.value,
        OrderStartDate: resolvedOrderStartDate.value,
        OrderEndDate: resolvedOrderEndDate.value,
        ClaimedStartDate: resolvedClaimedStartDate.value,
        ClaimedEndDate: resolvedClaimedEndDate.value,
      }),
    ),
    queryFn: () =>
      loketMonitoringService.getMonitoring({
        programId: resolvedProgramId.value!,
        Page: resolvedPage.value,
        PerPage: resolvedSize.value,
        Keyword: resolvedKeyword.value,
        OrderStartDate: resolvedOrderStartDate.value,
        OrderEndDate: resolvedOrderEndDate.value,
        Claimed: resolvedClaimed.value,
        ClaimedStartDate: resolvedClaimedStartDate.value,
        ClaimedEndDate: resolvedClaimedEndDate.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

export function useLoketMonitoringExport() {
  return useMutation({
    mutationFn: (params: LoketMonitoringParams) => loketMonitoringService.exportMonitoring(params),
  })
}
