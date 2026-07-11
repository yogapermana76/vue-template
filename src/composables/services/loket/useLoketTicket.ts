/**
 * Loket Ticket Composables
 * Using TanStack Query for ticket scan and claim operations in the Loket module
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { loketTicketService } from '@/services/loket'
import { config } from '@/config'
import type {
  UseLoketTicketDetailParams,
  UseLoketScanTicketParams,
  LoketClaimTicketRequest,
} from '@/types/services/loket'

// ============================================
// Query Keys
// ============================================

export const loketTicketKeys = {
  all: ['loket-ticket'] as const,
  detail: (programId?: number, code?: string) =>
    [...loketTicketKeys.all, 'detail', programId, code] as const,
  scan: (code?: string) => [...loketTicketKeys.all, 'scan', code] as const,
}

// ============================================
// Queries
// ============================================

export function useLoketTicketDetail(params: UseLoketTicketDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId, code } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedCode = computed(() => unref(code))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value && !!resolvedCode.value
      : !!resolvedProgramId.value && !!resolvedCode.value,
  )

  return useQuery({
    queryKey: computed(() => loketTicketKeys.detail(resolvedProgramId.value, resolvedCode.value)),
    queryFn: () =>
      loketTicketService.getDetail({
        programId: resolvedProgramId.value!,
        code: resolvedCode.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useLoketScanTicket(params: UseLoketScanTicketParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { code } = pathParams

  const resolvedCode = computed(() => unref(code))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedCode.value
      : !!resolvedCode.value,
  )

  return useQuery({
    queryKey: computed(() => loketTicketKeys.scan(resolvedCode.value)),
    queryFn: () => loketTicketService.scanTicket({ code: resolvedCode.value! }),
    staleTime: 0,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

export function useLoketClaimTicket() {
  return useMutation({
    mutationFn: (request: LoketClaimTicketRequest) => loketTicketService.claimTicket(request),
  })
}
