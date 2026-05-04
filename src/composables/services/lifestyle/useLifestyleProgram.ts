/**
 * Lifestyle Program Composables
 * Using TanStack Query for program/event operations in Lifestyle API
 */

import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { lifestyleProgramService } from '@/services/lifestyle'
import { config } from '@/config'
import type { BaseComposableParams, MaybeRef } from '@/types/common/base.types'
import type {
  LifestyleArticleSearchParams,
  LifestyleListVisitDateParams,
  LifestyleListTicketByVisitDateParams,
  LifestyleDetailTicketCategoryParams,
  LifestyleCategoryListTicketParams,
  LifestyleBannerParams,
  LifestyleProgramSearchParams,
  LifestyleProgramCountParams,
} from '@/types'

// ============================================
// Query Keys
// ============================================

export const lifestyleProgramKeys = {
  all: ['lifestyle-program'] as const,
  articleNusantara: () => [...lifestyleProgramKeys.all, 'article-nusantara'] as const,
  articleSearch: (query?: LifestyleArticleSearchParams) =>
    [...lifestyleProgramKeys.all, 'article-search', query] as const,
  articleDetail: (id?: number) => [...lifestyleProgramKeys.all, 'article-detail', id] as const,
  programDetail: (programId?: number) =>
    [...lifestyleProgramKeys.all, 'program-detail', programId] as const,
  listVisitDate: (params?: LifestyleListVisitDateParams) =>
    [...lifestyleProgramKeys.all, 'list-visit-date', params] as const,
  listTicketByVisitDate: (params?: LifestyleListTicketByVisitDateParams) =>
    [...lifestyleProgramKeys.all, 'list-ticket-by-visit-date', params] as const,
  detailTicketCategory: (params?: LifestyleDetailTicketCategoryParams) =>
    [...lifestyleProgramKeys.all, 'detail-ticket-category', params] as const,
  categoryListTicket: (params?: LifestyleCategoryListTicketParams) =>
    [...lifestyleProgramKeys.all, 'category-list-ticket', params] as const,
  getForm: (programId?: number) => [...lifestyleProgramKeys.all, 'get-form', programId] as const,
  banners: (params?: LifestyleBannerParams) =>
    [...lifestyleProgramKeys.all, 'banners', params] as const,
  programTypes: () => [...lifestyleProgramKeys.all, 'program-types'] as const,
  programRecommendations: () => [...lifestyleProgramKeys.all, 'program-recommendations'] as const,
  programSearch: (params?: LifestyleProgramSearchParams) =>
    [...lifestyleProgramKeys.all, 'program-search', params] as const,
  programCategories: () => [...lifestyleProgramKeys.all, 'program-categories'] as const,
  attendanceModes: () => [...lifestyleProgramKeys.all, 'attendance-modes'] as const,
  programCount: (params?: LifestyleProgramCountParams) =>
    [...lifestyleProgramKeys.all, 'program-count', params] as const,
}

// ============================================
// Composable Parameter Types
// ============================================

type UseLifestyleArticleSearchParams = BaseComposableParams<
  Omit<LifestyleArticleSearchParams, 'page' | 'size'>
>
type UseLifestyleProgramDetailParams = BaseComposableParams<never, { programId?: MaybeRef<number> }>
type UseLifestyleListVisitDateParams = BaseComposableParams<
  never,
  {
    programId?: MaybeRef<number>
    programScheduleCategoryFlag?: MaybeRef<'DAILY' | 'DATE_RANGE'>
    programTicketCategoryId?: MaybeRef<number>
  }
>
type UseLifestyleListTicketByVisitDateParams = BaseComposableParams<
  never,
  {
    programId?: MaybeRef<number>
    programScheduleCategoryFlag?: MaybeRef<'DAILY' | 'DATE_RANGE'>
    date?: MaybeRef<string>
  }
>
type UseLifestyleDetailTicketCategoryParams = BaseComposableParams<
  never,
  {
    programId?: MaybeRef<number>
    programTicketCategoryId?: MaybeRef<number>
    date?: MaybeRef<string>
    programScheduleCategoryFlag?: MaybeRef<'DAILY' | 'DATE_RANGE'>
  }
>
type UseLifestyleCategoryListTicketParams = BaseComposableParams<
  never,
  {
    programId?: MaybeRef<number>
    programTicketCategoryId?: MaybeRef<number>
    programScheduleCategoryFlag?: MaybeRef<'DAILY' | 'DATE_RANGE'>
    date?: MaybeRef<string>
    dayNum?: MaybeRef<number>
  }
>
type UseLifestyleProgramSearchParams = BaseComposableParams<
  Omit<LifestyleProgramSearchParams, 'page' | 'size'>
>

// ============================================
// Queries
// ============================================

/**
 * Get articles grouped by province (Nusantara)
 */
export function useLifestyleArticleNusantara(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleProgramKeys.articleNusantara(),
    queryFn: () => lifestyleProgramService.getArticleNusantara(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Search articles
 */
export function useLifestyleArticleSearch(params: UseLifestyleArticleSearchParams = {}) {
  const { query = {}, options = {} } = params

  const resolvedQuery = computed(() => ({
    provinceId: unref(query.provinceId),
    cityId: unref(query.cityId),
    programTypeId: unref(query.programTypeId),
    programCategoryId: unref(query.programCategoryId),
  }))

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: computed(() => lifestyleProgramKeys.articleSearch(resolvedQuery.value)),
    queryFn: () => lifestyleProgramService.searchArticles(resolvedQuery.value),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get program detail
 */
export function useLifestyleProgramDetail(params: UseLifestyleProgramDetailParams = {}) {
  const { params: pathParams = {}, options = {} } = params
  const { programId } = pathParams

  const resolvedProgramId = computed(() => unref(programId))

  const defaultEnabled = computed(() => !!resolvedProgramId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => lifestyleProgramKeys.programDetail(resolvedProgramId.value)),
    queryFn: () =>
      lifestyleProgramService.getProgramDetail({ programId: resolvedProgramId.value! }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get list of available visit dates for a program
 */
export function useLifestyleListVisitDate(params: UseLifestyleListVisitDateParams = {}) {
  const { params: pathParams = {}, options = {} } = params

  const resolvedProgramId = computed(() => unref(pathParams.programId))
  const resolvedScheduleFlag = computed(() => unref(pathParams.programScheduleCategoryFlag))
  const resolvedTicketCategoryId = computed(() => unref(pathParams.programTicketCategoryId))

  const defaultEnabled = computed(() => !!resolvedProgramId.value && !!resolvedScheduleFlag.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      lifestyleProgramKeys.listVisitDate({
        programId: resolvedProgramId.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
        programTicketCategoryId: resolvedTicketCategoryId.value,
      }),
    ),
    queryFn: () =>
      lifestyleProgramService.getListVisitDate({
        programId: resolvedProgramId.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
        programTicketCategoryId: resolvedTicketCategoryId.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get list of tickets by visit date
 */
export function useLifestyleListTicketByVisitDate(
  params: UseLifestyleListTicketByVisitDateParams = {},
) {
  const { params: pathParams = {}, options = {} } = params

  const resolvedProgramId = computed(() => unref(pathParams.programId))
  const resolvedScheduleFlag = computed(() => unref(pathParams.programScheduleCategoryFlag))
  const resolvedDate = computed(() => unref(pathParams.date))

  const defaultEnabled = computed(
    () => !!resolvedProgramId.value && !!resolvedScheduleFlag.value && !!resolvedDate.value,
  )
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      lifestyleProgramKeys.listTicketByVisitDate({
        programId: resolvedProgramId.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
        date: resolvedDate.value!,
      }),
    ),
    queryFn: () =>
      lifestyleProgramService.getListTicketByVisitDate({
        programId: resolvedProgramId.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
        date: resolvedDate.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get ticket category detail
 */
export function useLifestyleDetailTicketCategory(
  params: UseLifestyleDetailTicketCategoryParams = {},
) {
  const { params: pathParams = {}, options = {} } = params

  const resolvedProgramId = computed(() => unref(pathParams.programId))
  const resolvedTicketCategoryId = computed(() => unref(pathParams.programTicketCategoryId))
  const resolvedDate = computed(() => unref(pathParams.date))
  const resolvedScheduleFlag = computed(() => unref(pathParams.programScheduleCategoryFlag))

  const defaultEnabled = computed(
    () =>
      !!resolvedProgramId.value &&
      !!resolvedTicketCategoryId.value &&
      !!resolvedDate.value &&
      !!resolvedScheduleFlag.value,
  )
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      lifestyleProgramKeys.detailTicketCategory({
        programId: resolvedProgramId.value!,
        programTicketCategoryId: resolvedTicketCategoryId.value!,
        date: resolvedDate.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
      }),
    ),
    queryFn: () =>
      lifestyleProgramService.getDetailTicketCategory({
        programId: resolvedProgramId.value!,
        programTicketCategoryId: resolvedTicketCategoryId.value!,
        date: resolvedDate.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get list of tickets by category
 */
export function useLifestyleCategoryListTicket(params: UseLifestyleCategoryListTicketParams = {}) {
  const { params: pathParams = {}, options = {} } = params

  const resolvedProgramId = computed(() => unref(pathParams.programId))
  const resolvedTicketCategoryId = computed(() => unref(pathParams.programTicketCategoryId))
  const resolvedScheduleFlag = computed(() => unref(pathParams.programScheduleCategoryFlag))
  const resolvedDate = computed(() => unref(pathParams.date))
  const resolvedDayNum = computed(() => unref(pathParams.dayNum))

  const defaultEnabled = computed(
    () =>
      !!resolvedProgramId.value &&
      !!resolvedTicketCategoryId.value &&
      !!resolvedScheduleFlag.value &&
      !!resolvedDate.value,
  )
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() =>
      lifestyleProgramKeys.categoryListTicket({
        programId: resolvedProgramId.value!,
        programTicketCategoryId: resolvedTicketCategoryId.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
        date: resolvedDate.value!,
        dayNum: resolvedDayNum.value,
      }),
    ),
    queryFn: () =>
      lifestyleProgramService.getCategoryListTicket({
        programId: resolvedProgramId.value!,
        programTicketCategoryId: resolvedTicketCategoryId.value!,
        programScheduleCategoryFlag: resolvedScheduleFlag.value!,
        date: resolvedDate.value!,
        dayNum: resolvedDayNum.value,
      }),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get banners
 */
export function useLifestyleBanners(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleProgramKeys.banners(),
    queryFn: () => lifestyleProgramService.getBanners(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get program types
 */
export function useLifestyleProgramTypes(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleProgramKeys.programTypes(),
    queryFn: () => lifestyleProgramService.getProgramTypes(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get program recommendations
 */
export function useLifestyleProgramRecommendations(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleProgramKeys.programRecommendations(),
    queryFn: () => lifestyleProgramService.getRecommendations(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Search programs
 */
export function useLifestyleProgramSearch(params: UseLifestyleProgramSearchParams = {}) {
  const { query = {}, options = {} } = params

  const resolvedQuery = computed(() => ({
    keyword: unref(query.keyword),
    provinceId: unref(query.provinceId),
    cityId: unref(query.cityId),
    programTypeId: unref(query.programTypeId),
    programCategoryId: unref(query.programCategoryId),
    attendanceModeId: unref(query.attendanceModeId),
    startDate: unref(query.startDate),
    endDate: unref(query.endDate),
    minPrice: unref(query.minPrice),
    maxPrice: unref(query.maxPrice),
    page: unref(query.page),
    size: unref(query.size),
  }))

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: computed(() => lifestyleProgramKeys.programSearch(resolvedQuery.value)),
    queryFn: () => lifestyleProgramService.searchPrograms(resolvedQuery.value),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get program categories
 */
export function useLifestyleProgramCategories(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleProgramKeys.programCategories(),
    queryFn: () => lifestyleProgramService.getProgramCategories(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}

/**
 * Get attendance modes
 */
export function useLifestyleAttendanceModes(params: BaseComposableParams = {}) {
  const { options = {} } = params

  const resolvedEnabled = computed(() =>
    options.enabled !== undefined ? unref(options.enabled) : true,
  )

  return useQuery({
    queryKey: lifestyleProgramKeys.attendanceModes(),
    queryFn: () => lifestyleProgramService.getAttendanceModes(),
    staleTime: options.staleTime ?? config.cache.defaultStaleTime,
    enabled: resolvedEnabled,
  })
}
