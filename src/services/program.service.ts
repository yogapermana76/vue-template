/**
 * Program Service
 * Handles program/dashboard data for the app.
 *
 * All query params are passed through `stripEmpty()` so absent/optional fields
 * are omitted from the URL entirely — the backend interprets
 * `?StartDate=` (empty string) differently from an omitted key, so we never
 * want to serialise blank values.
 */

import { http } from './http'
import { stripEmpty } from './http/params'
import { ProgramEndpoint } from './endpoints'
import type {
  ProgramListParams,
  BannersParams,
  CategoriesParams,
  ScheduleListParams,
  StatisticsParams,
  ProgramListResponse,
  BannerListResponse,
  CategoryListResponse,
  ScheduleListResponse,
  StatisticsResponse,
} from '@/types/services'

export const programService = {
  async getPrograms(params?: ProgramListParams): Promise<ProgramListResponse> {
    const { data } = await http.get<ProgramListResponse>(ProgramEndpoint.PROGRAMS, {
      params: stripEmpty(params ?? {}),
    })
    return data
  },

  async getBanners(params: BannersParams): Promise<BannerListResponse> {
    const { data } = await http.get<BannerListResponse>(ProgramEndpoint.BANNERS(params.programId))
    return data
  },

  async getCategories(params: CategoriesParams): Promise<CategoryListResponse> {
    const { data } = await http.get<CategoryListResponse>(
      ProgramEndpoint.CATEGORIES(params.programId),
    )
    return data
  },

  async getSchedules(params: ScheduleListParams): Promise<ScheduleListResponse> {
    const { Page, PerPage } = params
    const { data } = await http.get<ScheduleListResponse>(
      ProgramEndpoint.SCHEDULES(params.programId),
      {
        params: stripEmpty({ Page, PerPage }),
      },
    )
    return data
  },

  async getStatistics(params: StatisticsParams): Promise<StatisticsResponse> {
    const { StartDate, EndDate, CategoryId } = params
    const { data } = await http.get<StatisticsResponse>(
      ProgramEndpoint.STATISTICS(params.programId),
      {
        params: stripEmpty({ StartDate, EndDate, CategoryId }),
      },
    )
    return data
  },
}
