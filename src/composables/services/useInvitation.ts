/**
 * Invitation Composables
 * Using TanStack Query for invitation registration + info in the app
 */

import { computed, unref } from 'vue'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/vue-query'
import { invitationService } from '@/services'
import { config } from '@/config'
import type {
  ApproveInvitationBody,
  InvitationStatus,
  RegisterInvitationParams,
  UseInvitationCategoryInfoParams,
  UseInvitationCountParams,
  UseInvitationListParams,
  UseInvitationProgramInfoParams,
  UseInvitationSummaryParams,
} from '@/types/services'

// ============================================
// Query Keys
// ============================================

export const invitationKeys = {
  all: ['invitation'] as const,
  programInfo: (programId?: number) => [...invitationKeys.all, 'program-info', programId] as const,
  categoryInfo: (programId?: number, categoryId?: number) =>
    [...invitationKeys.all, 'category-info', programId, categoryId] as const,
  summary: (programId?: number) => [...invitationKeys.all, 'summary', programId] as const,
  count: (
    programId?: number,
    query?: { categoryId?: number; keyword?: string; status?: InvitationStatus },
  ) => [...invitationKeys.all, 'count', programId, query] as const,
  list: (
    programId?: number,
    query?: {
      page?: number
      size?: number
      categoryId?: number
      keyword?: string
      status?: InvitationStatus
    },
  ) => [...invitationKeys.all, 'list', programId, query] as const,
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

export function useInvitationSummary(params: UseInvitationSummaryParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() => invitationKeys.summary(resolvedProgramId.value)),
    queryFn: () => invitationService.getSummary({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    refetchInterval: options.refetchInterval,
    refetchIntervalInBackground: options.refetchIntervalInBackground,
    enabled: resolvedEnabled,
  })
}

export function useInvitationCount(params: UseInvitationCountParams = {}) {
  const { params: pathParams = {}, query = {}, options = {} } = params
  const { programId } = pathParams
  const { categoryId, keyword, status } = query

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedCategoryId = computed(() => unref(categoryId))
  const resolvedKeyword = computed(() => unref(keyword))
  const resolvedStatus = computed(() => unref(status))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() =>
      invitationKeys.count(resolvedProgramId.value, {
        categoryId: resolvedCategoryId.value,
        keyword: resolvedKeyword.value,
        status: resolvedStatus.value,
      }),
    ),
    queryFn: () =>
      invitationService.getCount({
        programId: resolvedProgramId.value!,
        query: {
          categoryId: resolvedCategoryId.value,
          keyword: resolvedKeyword.value,
          status: resolvedStatus.value,
        },
      }),
    // Retain the previous value while a new query is inflight so the counters
    // don't flash to zero on filter/status changes.
    placeholderData: keepPreviousData,
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    refetchInterval: options.refetchInterval,
    refetchIntervalInBackground: options.refetchIntervalInBackground,
    enabled: resolvedEnabled,
  })
}

export function useInvitationList(params: UseInvitationListParams = {}) {
  const { params: pathParams = {}, query = {}, options = {} } = params
  const { programId } = pathParams
  const { page, size, categoryId, keyword, status } = query

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))
  const resolvedCategoryId = computed(() => unref(categoryId))
  const resolvedKeyword = computed(() => unref(keyword))
  const resolvedStatus = computed(() => unref(status))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() =>
      invitationKeys.list(resolvedProgramId.value, {
        page: resolvedPage.value,
        size: resolvedSize.value,
        categoryId: resolvedCategoryId.value,
        keyword: resolvedKeyword.value,
        status: resolvedStatus.value,
      }),
    ),
    queryFn: () =>
      invitationService.getList({
        programId: resolvedProgramId.value!,
        query: {
          page: resolvedPage.value,
          size: resolvedSize.value,
          categoryId: resolvedCategoryId.value,
          keyword: resolvedKeyword.value,
          status: resolvedStatus.value,
        },
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
