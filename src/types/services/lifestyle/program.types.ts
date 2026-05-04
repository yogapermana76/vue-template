/**
 * Lifestyle Program Types
 * Types for program/event management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'
import type {
  ProgramDetailData,
  VisitDateDataDaily,
  VisitDateDataDateRange,
  TicketCategory,
  TicketCategoryDetail,
  CategoryTicket,
} from './booking.types'

// ============================================
// Common Entities
// ============================================

export interface LifestyleArticle {
  id: number
  title: string
  provinceId: number
  provinceName: string
}

export interface LifestyleBanner {
  id: number
  title: string
  imageUrl: string
  deeplink?: string
}

export interface LifestyleProgramType {
  id: number
  name: string
  iconUrl: string
}

export interface LifestyleProgramCategory {
  id: number
  name: string
  iconUrl: string
}

export interface LifestyleAttendanceMode {
  id: number
  name: string
  code: string
}

export interface LifestyleProgram {
  programId: number
  programName: string
  programCategory: string
  imageUrl: string
  location: string
  startDate: string
  endDate: string
  price: number
  discountedPrice?: number
}

// ============================================
// Request Types
// ============================================

export interface LifestyleArticleSearchParams {
  provinceId?: number
  cityId?: number
  programTypeId?: number
  programCategoryId?: number
}

export interface LifestyleProgramDetailParams {
  programId: number
}

export interface LifestyleListVisitDateParams {
  programId: number
  programScheduleCategoryFlag: 'DAILY' | 'DATE_RANGE'
  programTicketCategoryId?: number
}

export interface LifestyleListTicketByVisitDateParams {
  programId: number
  programScheduleCategoryFlag: 'DAILY' | 'DATE_RANGE'
  date: string // YYYY-MM-DD
}

export interface LifestyleDetailTicketCategoryParams {
  programId: number
  programTicketCategoryId: number
  date: string // YYYY-MM-DD
  programScheduleCategoryFlag: 'DAILY' | 'DATE_RANGE'
}

export interface LifestyleCategoryListTicketParams {
  programId: number
  programTicketCategoryId: number
  programScheduleCategoryFlag: 'DAILY' | 'DATE_RANGE'
  date: string // YYYY-MM-DD
  dayNum?: number
}

export interface LifestyleGetFormParams {
  programId: number
}

export interface LifestyleBannerParams {
  position?: string
}

export interface LifestyleProgramSearchParams {
  keyword?: string
  provinceId?: number
  cityId?: number
  programTypeId?: number
  programCategoryId?: number
  attendanceModeId?: number
  startDate?: string
  endDate?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

export interface LifestyleProgramCountParams {
  provinceId?: number
  cityId?: number
  programTypeId?: number
  programCategoryId?: number
  attendanceModeId?: number
}

// ============================================
// Response Types
// ============================================

export type LifestyleArticleGroupProvinceResponse = {
  code: string
  message: string
  data: Record<string, LifestyleArticle[]>
}

export type LifestyleArticleListResponse = LifestyleArticleGroupProvinceResponse

export type LifestyleArticleDetailResponse = LifestyleArticleGroupProvinceResponse

export type LifestyleProgramDetailResponse = BaseResponse<ProgramDetailData>

export type LifestyleListVisitDateResponse = BaseResponse<
  VisitDateDataDaily | VisitDateDataDateRange
>

export type LifestyleListTicketByVisitDateResponse = BaseResponse<TicketCategory[]>

export type LifestyleDetailTicketCategoryResponse = BaseResponse<TicketCategoryDetail>

export type LifestyleCategoryListTicketResponse = BaseResponse<CategoryTicket[]>

export type LifestyleGetFormResponse = BaseResponse<unknown>

export type LifestyleBannerResponse = {
  code: string
  message: string
  data: LifestyleBanner[]
}

export type LifestyleProgramTypeResponse = {
  code: string
  message: string
  data: LifestyleProgramType[]
}

export type LifestyleProgramCategoryResponse = {
  code: string
  message: string
  data: LifestyleProgramCategory[]
}

export type LifestyleAttendanceModeResponse = {
  code: string
  message: string
  data: LifestyleAttendanceMode[]
}

export type LifestyleProgramRecommendationResponse = {
  code: string
  message: string
  data: LifestyleProgram[]
}

export type LifestyleProgramSearchResponse = {
  code: string
  message: string
  data: {
    programs: LifestyleProgram[]
    total: number
  }
}

export type LifestyleProgramCountResponse = {
  code: string
  message: string
  data: {
    count: number
  }
}
