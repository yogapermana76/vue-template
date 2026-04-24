/**
 * Lifestyle Program Types
 * Types for program/event management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Common Entities
// ============================================

export interface LifestyleArticle {
  id: number
  title: string
  provinceId: number
  provinceName: string
}

export interface LifestyleProgramContact {
  name: string
  email: string
  phone: string
}

export interface LifestyleProgramFacility {
  name: string
  iconUrl: string
}

export interface LifestyleProgramInfoSection {
  title: string
  iconUrl: string
  messages: string[]
}

export interface LifestyleProgramSchedule {
  dayName: string
  dayNum: string
  startTime: string
  endTime: string
  isActive: boolean
}

export interface LifestyleTicketInformation {
  description: string
  benefitTickets: string[]
  listEffectiveDay: string[] | null
  ticketRedemption: string
  listEffectiveDate: string[] | null
  termsAndConditions: string
  additionalInformation: string[]
}

export interface LifestyleTicketCategory {
  programTicketCategoryId: number
  ticketCategory: string
  information: LifestyleTicketInformation
  discountValue: number
  discountCostType: string
  amountDiscount: number
  beforeDiscountPrice: number
  afterDiscount: number
  finalPrice: number
  basePrice: number
  quotaUsed: number
  remainingQuota: number
  earliestStartSaleDatetime: string
  latestEndSaleDatetime: string
}

export interface LifestyleProgramDetail {
  programId: number
  programName: string
  programScheduleCategory: string
  programScheduleCategoryFlag: string
  programCategory: string
  contact: LifestyleProgramContact[]
  facilities: LifestyleProgramFacility[]
  infoSection: LifestyleProgramInfoSection
  termsAndConditions: string
  schedules: LifestyleProgramSchedule[]
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
  programScheduleCategoryFlag: string
  programTicketCategoryId?: number
}

export interface LifestyleListTicketByVisitDateParams {
  programId: number
  programScheduleCategoryFlag: string
  date: string // YYYY-MM-DD
}

export interface LifestyleDetailTicketCategoryParams {
  programId: number
  programTicketCategoryId: number
}

export interface LifestyleCategoryListTicketParams {
  programId: number
  programScheduleCategoryFlag: string
  date?: string // YYYY-MM-DD
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

export type LifestyleProgramDetailResponse = {
  code: string
  message: string
  data: LifestyleProgramDetail
}

export type LifestyleListVisitDateResponse = {
  code: string
  message: string
  data: {
    visitDates: string[]
  }
}

export type LifestyleListTicketByVisitDateResponse = {
  code: string
  message: string
  data: LifestyleTicketCategory[]
}

export type LifestyleDetailTicketCategoryResponse = {
  code: string
  message: string
  data: LifestyleTicketCategory
}

export type LifestyleCategoryListTicketResponse = LifestyleListTicketByVisitDateResponse

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
