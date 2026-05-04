/**
 * Lifestyle Program Service
 * Handles program/event-related API calls for Lifestyle
 */

import { http } from '../http'
import { LifestyleProgramEndpoint } from './endpoints'
import type {
  LifestyleArticleGroupProvinceResponse,
  LifestyleArticleListResponse,
  LifestyleArticleSearchParams,
  LifestyleArticleDetailResponse,
  LifestyleProgramDetailResponse,
  LifestyleProgramDetailParams,
  LifestyleListVisitDateResponse,
  LifestyleListVisitDateParams,
  LifestyleListTicketByVisitDateResponse,
  LifestyleListTicketByVisitDateParams,
  LifestyleDetailTicketCategoryResponse,
  LifestyleDetailTicketCategoryParams,
  LifestyleCategoryListTicketResponse,
  LifestyleCategoryListTicketParams,
  LifestyleGetFormResponse,
  LifestyleGetFormParams,
  LifestyleBannerResponse,
  LifestyleBannerParams,
  LifestyleProgramTypeResponse,
  LifestyleProgramRecommendationResponse,
  LifestyleProgramSearchResponse,
  LifestyleProgramSearchParams,
  LifestyleProgramCategoryResponse,
  LifestyleAttendanceModeResponse,
  LifestyleProgramCountResponse,
  LifestyleProgramCountParams,
} from '@/types/services/lifestyle'

export const lifestyleProgramService = {
  // ============================================
  // Article APIs
  // ============================================

  /**
   * Get articles grouped by province (Nusantara)
   */
  async getArticleNusantara(): Promise<LifestyleArticleGroupProvinceResponse> {
    const { data } = await http.get<LifestyleArticleGroupProvinceResponse>(
      LifestyleProgramEndpoint.ARTICLE_NUSANTARA,
    )
    return data
  },

  /**
   * Search articles
   */
  async searchArticles(
    params?: LifestyleArticleSearchParams,
  ): Promise<LifestyleArticleListResponse> {
    const { data } = await http.get<LifestyleArticleListResponse>(
      LifestyleProgramEndpoint.ARTICLE_SEARCH,
      { params },
    )
    return data
  },

  /**
   * Get article detail
   */
  async getArticleDetail(id: number): Promise<LifestyleArticleDetailResponse> {
    const url = LifestyleProgramEndpoint.ARTICLE_DETAIL.replace(':id', String(id))
    const { data } = await http.get<LifestyleArticleDetailResponse>(url)
    return data
  },

  // ============================================
  // Program APIs
  // ============================================

  /**
   * Get program detail
   */
  async getProgramDetail(
    params: LifestyleProgramDetailParams,
  ): Promise<LifestyleProgramDetailResponse> {
    const { data } = await http.get<LifestyleProgramDetailResponse>(
      LifestyleProgramEndpoint.PROGRAM_DETAIL,
      { params },
    )
    return data
  },

  /**
   * Get list of available visit dates for a program
   */
  async getListVisitDate(
    params: LifestyleListVisitDateParams,
  ): Promise<LifestyleListVisitDateResponse> {
    const { data } = await http.get<LifestyleListVisitDateResponse>(
      LifestyleProgramEndpoint.PROGRAM_LIST_VISIT_DATE,
      { params },
    )
    return data
  },

  /**
   * Get list of tickets by visit date
   */
  async getListTicketByVisitDate(
    params: LifestyleListTicketByVisitDateParams,
  ): Promise<LifestyleListTicketByVisitDateResponse> {
    const { data } = await http.get<LifestyleListTicketByVisitDateResponse>(
      LifestyleProgramEndpoint.PROGRAM_LIST_TICKET_BY_VISIT_DATE,
      { params },
    )
    return data
  },

  /**
   * Get ticket category detail
   */
  async getDetailTicketCategory(
    params: LifestyleDetailTicketCategoryParams,
  ): Promise<LifestyleDetailTicketCategoryResponse> {
    const { data } = await http.get<LifestyleDetailTicketCategoryResponse>(
      LifestyleProgramEndpoint.PROGRAM_DETAIL_TICKET_CATEGORIES,
      { params },
    )
    return data
  },

  /**
   * Get list of tickets by category
   */
  async getCategoryListTicket(
    params: LifestyleCategoryListTicketParams,
  ): Promise<LifestyleCategoryListTicketResponse> {
    const { data } = await http.get<LifestyleCategoryListTicketResponse>(
      LifestyleProgramEndpoint.PROGRAM_CATEGORY_LIST_TICKET,
      { params },
    )
    return data
  },

  /**
   * Get program form
   */
  async getForm(params: LifestyleGetFormParams): Promise<LifestyleGetFormResponse> {
    const { data } = await http.get<LifestyleGetFormResponse>(
      LifestyleProgramEndpoint.PROGRAM_GET_FORM,
      { params },
    )
    return data
  },

  /**
   * Get banners
   */
  async getBanners(params?: LifestyleBannerParams): Promise<LifestyleBannerResponse> {
    const { data } = await http.get<LifestyleBannerResponse>(
      LifestyleProgramEndpoint.PROGRAM_BANNER,
      { params },
    )
    return data
  },

  /**
   * Get program types
   */
  async getProgramTypes(): Promise<LifestyleProgramTypeResponse> {
    const { data } = await http.get<LifestyleProgramTypeResponse>(
      LifestyleProgramEndpoint.PROGRAM_TYPE,
    )
    return data
  },

  /**
   * Get program recommendations
   */
  async getRecommendations(): Promise<LifestyleProgramRecommendationResponse> {
    const { data } = await http.get<LifestyleProgramRecommendationResponse>(
      LifestyleProgramEndpoint.PROGRAM_RECOMMENDATION,
    )
    return data
  },

  /**
   * Search programs
   */
  async searchPrograms(
    params?: LifestyleProgramSearchParams,
  ): Promise<LifestyleProgramSearchResponse> {
    const { data } = await http.get<LifestyleProgramSearchResponse>(
      LifestyleProgramEndpoint.PROGRAM_SEARCH,
      { params },
    )
    return data
  },

  /**
   * Get program categories
   */
  async getProgramCategories(): Promise<LifestyleProgramCategoryResponse> {
    const { data } = await http.get<LifestyleProgramCategoryResponse>(
      LifestyleProgramEndpoint.PROGRAM_CATEGORY,
    )
    return data
  },

  /**
   * Get attendance modes
   */
  async getAttendanceModes(): Promise<LifestyleAttendanceModeResponse> {
    const { data } = await http.get<LifestyleAttendanceModeResponse>(
      LifestyleProgramEndpoint.PROGRAM_ATTENDANCE_MODE,
    )
    return data
  },

  /**
   * Get total program count by criteria
   */
  async getProgramCount(
    params?: LifestyleProgramCountParams,
  ): Promise<LifestyleProgramCountResponse> {
    const { data } = await http.get<LifestyleProgramCountResponse>(
      LifestyleProgramEndpoint.PROGRAM_COUNT,
      { params },
    )
    return data
  },
}
