/**
 * Program Composables
 * Using TanStack Query for program/dashboard operations in the app
 */

import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { programService } from '@/services'
import { config } from '@/config'
import type {
  UseProgramsParams,
  UseBannersParams,
  UseCategoriesParams,
  UseSchedulesParams,
  UseStatisticsParams,
} from '@/types/services'

// ============================================
// Query Keys
// ============================================

export const programKeys = {
  all: ['program'] as const,
  programs: (query?: { Name?: string; page?: number; size?: number }) =>
    [...programKeys.all, 'list', query] as const,
  banners: (programId?: number) => [...programKeys.all, 'banners', programId] as const,
  categories: (programId?: number) => [...programKeys.all, 'categories', programId] as const,
  schedules: (programId?: number, query?: { page?: number; size?: number }) =>
    [...programKeys.all, 'schedules', programId, query] as const,
  statistics: (
    programId?: number,
    query?: { StartDate?: string; EndDate?: string; CategoryId?: number },
  ) => [...programKeys.all, 'statistics', programId, query] as const,
}

// ============================================
// Queries
// ============================================

export function usePrograms(params: UseProgramsParams = {}) {
  const { query = {}, options = {} } = params
  const { page, size, Name } = query

  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))
  const resolvedName = computed(() => unref(Name))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: computed(() =>
      programKeys.programs({
        page: resolvedPage.value,
        size: resolvedSize.value,
        Name: resolvedName.value,
      }),
    ),
    queryFn: () =>
      programService.getPrograms({
        Page: resolvedPage.value,
        PerPage: resolvedSize.value,
        Name: resolvedName.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useBanners(params: UseBannersParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() => programKeys.banners(resolvedProgramId.value)),
    queryFn: () => programService.getBanners({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useCategories(params: UseCategoriesParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() => programKeys.categories(resolvedProgramId.value)),
    queryFn: () => programService.getCategories({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useSchedules(params: UseSchedulesParams = {}) {
  const { query = {}, params: pathParams = {}, options = {} } = params
  const { page, size } = query
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedPage = computed(() => unref(page))
  const resolvedSize = computed(() => unref(size))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() =>
      programKeys.schedules(resolvedProgramId.value, {
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    ),
    queryFn: () =>
      programService.getSchedules({
        programId: resolvedProgramId.value!,
        Page: resolvedPage.value,
        PerPage: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useStatistics(params: UseStatisticsParams = {}) {
  const { query = {}, params: pathParams = {}, options = {} } = params
  const { StartDate, EndDate, CategoryId } = query
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedStartDate = computed(() => unref(StartDate))
  const resolvedEndDate = computed(() => unref(EndDate))
  const resolvedCategoryId = computed(() => unref(CategoryId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() =>
      programKeys.statistics(resolvedProgramId.value, {
        StartDate: resolvedStartDate.value,
        EndDate: resolvedEndDate.value,
        CategoryId: resolvedCategoryId.value,
      }),
    ),
    queryFn: () =>
      programService.getStatistics({
        programId: resolvedProgramId.value!,
        StartDate: resolvedStartDate.value,
        EndDate: resolvedEndDate.value,
        CategoryId: resolvedCategoryId.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
    // Semi-realtime polling: consumers opt in by passing `refetchInterval`
    // (e.g. dashboard sets 5000). Falsy → no polling.
    refetchInterval: options.refetchInterval ?? false,
    refetchIntervalInBackground: options.refetchIntervalInBackground ?? false,
  })
}
