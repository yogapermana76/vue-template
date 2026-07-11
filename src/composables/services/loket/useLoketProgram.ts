/**
 * Loket Program Composables
 * Using TanStack Query for program/dashboard operations in the Loket module
 */

import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { loketProgramService } from '@/services/loket'
import { config } from '@/config'
import type {
  UseLoketProgramsParams,
  UseLoketBannersParams,
  UseLoketCategoriesParams,
  UseLoketSchedulesParams,
  UseLoketStatisticsParams,
} from '@/types/services/loket'

// ============================================
// Query Keys
// ============================================

export const loketProgramKeys = {
  all: ['loket-program'] as const,
  programs: (query?: { Name?: string; page?: number; size?: number }) =>
    [...loketProgramKeys.all, 'list', query] as const,
  banners: (programId?: number) => [...loketProgramKeys.all, 'banners', programId] as const,
  categories: (programId?: number) => [...loketProgramKeys.all, 'categories', programId] as const,
  schedules: (programId?: number, query?: { page?: number; size?: number }) =>
    [...loketProgramKeys.all, 'schedules', programId, query] as const,
  statistics: (
    programId?: number,
    query?: { StartDate?: string; EndDate?: string; CategoryId?: number },
  ) => [...loketProgramKeys.all, 'statistics', programId, query] as const,
}

// ============================================
// Queries
// ============================================

export function useLoketPrograms(params: UseLoketProgramsParams = {}) {
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
      loketProgramKeys.programs({
        page: resolvedPage.value,
        size: resolvedSize.value,
        Name: resolvedName.value,
      }),
    ),
    queryFn: () =>
      loketProgramService.getPrograms({
        Page: resolvedPage.value,
        PerPage: resolvedSize.value,
        Name: resolvedName.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useLoketBanners(params: UseLoketBannersParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() => loketProgramKeys.banners(resolvedProgramId.value)),
    queryFn: () => loketProgramService.getBanners({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useLoketCategories(params: UseLoketCategoriesParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && !!resolvedProgramId.value
      : !!resolvedProgramId.value,
  )

  return useQuery({
    queryKey: computed(() => loketProgramKeys.categories(resolvedProgramId.value)),
    queryFn: () => loketProgramService.getCategories({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useLoketSchedules(params: UseLoketSchedulesParams = {}) {
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
      loketProgramKeys.schedules(resolvedProgramId.value, {
        page: resolvedPage.value,
        size: resolvedSize.value,
      }),
    ),
    queryFn: () =>
      loketProgramService.getSchedules({
        programId: resolvedProgramId.value!,
        Page: resolvedPage.value,
        PerPage: resolvedSize.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

export function useLoketStatistics(params: UseLoketStatisticsParams = {}) {
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
      loketProgramKeys.statistics(resolvedProgramId.value, {
        StartDate: resolvedStartDate.value,
        EndDate: resolvedEndDate.value,
        CategoryId: resolvedCategoryId.value,
      }),
    ),
    queryFn: () =>
      loketProgramService.getStatistics({
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
