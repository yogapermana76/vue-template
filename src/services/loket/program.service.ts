/**
 * Loket Program Service
 * Handles program/dashboard data for the Loket module.
 *
 * All query params are passed through `stripEmpty()` so absent/optional fields
 * are omitted from the URL entirely — the loket backend interprets
 * `?StartDate=` (empty string) differently from an omitted key, so we never
 * want to serialise blank values.
 */

import { loketHttp } from '../http'
import { stripEmpty } from '../http/params'
import { LoketProgramEndpoint } from './endpoints'
import type {
  LoketProgramListParams,
  LoketBannersParams,
  LoketCategoriesParams,
  LoketScheduleListParams,
  LoketStatisticsParams,
  LoketProgramListResponse,
  LoketBannerListResponse,
  LoketCategoryListResponse,
  LoketScheduleListResponse,
  LoketStatisticsResponse,
} from '@/types/services/loket'

export const loketProgramService = {
  async getPrograms(params?: LoketProgramListParams): Promise<LoketProgramListResponse> {
    const { data } = await loketHttp.get<LoketProgramListResponse>(LoketProgramEndpoint.PROGRAMS, {
      params: stripEmpty(params ?? {}),
    })
    return data
  },

  async getBanners(params: LoketBannersParams): Promise<LoketBannerListResponse> {
    const url = LoketProgramEndpoint.BANNERS.replace(':programId', String(params.programId))
    const { data } = await loketHttp.get<LoketBannerListResponse>(url)
    return data
  },

  async getCategories(params: LoketCategoriesParams): Promise<LoketCategoryListResponse> {
    const url = LoketProgramEndpoint.CATEGORIES.replace(':programId', String(params.programId))
    const { data } = await loketHttp.get<LoketCategoryListResponse>(url)
    return data
  },

  async getSchedules(params: LoketScheduleListParams): Promise<LoketScheduleListResponse> {
    const url = LoketProgramEndpoint.SCHEDULES.replace(':programId', String(params.programId))
    const { Page, PerPage } = params
    const { data } = await loketHttp.get<LoketScheduleListResponse>(url, {
      params: stripEmpty({ Page, PerPage }),
    })
    return data
  },

  async getStatistics(params: LoketStatisticsParams): Promise<LoketStatisticsResponse> {
    const url = LoketProgramEndpoint.STATISTICS.replace(':programId', String(params.programId))
    const { StartDate, EndDate, CategoryId } = params
    const { data } = await loketHttp.get<LoketStatisticsResponse>(url, {
      params: stripEmpty({ StartDate, EndDate, CategoryId }),
    })
    return data
  },
}
