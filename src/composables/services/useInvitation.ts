/**
 * Invitation Composables
 * Using TanStack Query for invitation registration + info in the app
 */

import { computed, unref } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { invitationService } from '@/services'
import { config } from '@/config'
import type {
  ApproveInvitationBody,
  RegisterInvitationParams,
  UseInvitationCategoryInfoParams,
  UseInvitationProgramInfoParams,
} from '@/types/services'

// ============================================
// Query Keys
// ============================================

export const invitationKeys = {
  all: ['invitation'] as const,
  programInfo: (programId?: number) => [...invitationKeys.all, 'program-info', programId] as const,
  categoryInfo: (programId?: number, categoryId?: number) =>
    [...invitationKeys.all, 'category-info', programId, categoryId] as const,
}

// ============================================
// Queries
// ============================================

export function useInvitationProgramInfo(params: UseInvitationProgramInfoParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() => invitationKeys.programInfo(resolvedProgramId.value)),
    queryFn: () => invitationService.getProgramInfo({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useInvitationCategoryInfo(params: UseInvitationCategoryInfoParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId, categoryId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedCategoryId = computed(() => unref(categoryId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value && !!resolvedCategoryId.value
      : !!resolvedProgramId.value && !!resolvedCategoryId.value,
  )

  return useQuery({
    queryKey: computed(() =>
      invitationKeys.categoryInfo(resolvedProgramId.value, resolvedCategoryId.value),
    ),
    queryFn: () =>
      invitationService.getCategoryInfo({
        programId: resolvedProgramId.value!,
        categoryId: resolvedCategoryId.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    refetchInterval: options.refetchInterval,
    refetchIntervalInBackground: options.refetchIntervalInBackground,
    enabled: resolvedEnabled,
  })
}

// ============================================
// Mutations
// ============================================

export function useRegisterInvitation() {
  return useMutation({
    mutationFn: (params: RegisterInvitationParams) => invitationService.register(params),
  })
}

export function useApproveInvitation() {
  return useMutation({
    mutationFn: (body: ApproveInvitationBody) => invitationService.approve(body),
  })
}
