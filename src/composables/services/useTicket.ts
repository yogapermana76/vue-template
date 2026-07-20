/**
 * Ticket Composables
 * Using TanStack Query for ticket scan and claim operations in the app
 */

import { computed, unref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { ticketService } from '@/services'
import { config } from '@/config'
import type {
  UseTicketDetailParams,
  UseScanTicketParams,
  UseTicketFormParams,
  ClaimTicketRequest,
  EditVisitorBody,
} from '@/types/services'

// ============================================
// Query Keys
// ============================================

export const ticketKeys = {
  all: ['ticket'] as const,
  detail: (programId?: number, code?: string) =>
    [...ticketKeys.all, 'detail', programId, code] as const,
  scan: (code?: string) => [...ticketKeys.all, 'scan', code] as const,
  form: (programId?: number, code?: string) =>
    [...ticketKeys.all, 'form', programId, code] as const,
}

// ============================================
// Queries
// ============================================

export function useTicketDetail(params: UseTicketDetailParams = {}) {
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
    queryKey: computed(() => ticketKeys.detail(resolvedProgramId.value, resolvedCode.value)),
    queryFn: () =>
      ticketService.getDetail({
        programId: resolvedProgramId.value!,
        code: resolvedCode.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useScanTicket(params: UseScanTicketParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { code } = pathParams

  const resolvedCode = computed(() => unref(code))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedCode.value
      : !!resolvedCode.value,
  )

  return useQuery({
    queryKey: computed(() => ticketKeys.scan(resolvedCode.value)),
    queryFn: () => ticketService.scanTicket({ code: resolvedCode.value! }),
    staleTime: 0,
    enabled: resolvedEnabled,
  })
}

export function useTicketForm(params: UseTicketFormParams = {}) {
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
    queryKey: computed(() => ticketKeys.form(resolvedProgramId.value, resolvedCode.value)),
    queryFn: () =>
      ticketService.getForm({
        programId: resolvedProgramId.value!,
        code: resolvedCode.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

export function useClaimTicket() {
  return useMutation({
    mutationFn: (request: ClaimTicketRequest) => ticketService.claimTicket(request),
  })
}

export function useEditVisitor() {
  return useMutation({
    mutationFn: (body: EditVisitorBody) => ticketService.editVisitor(body),
  })
}
