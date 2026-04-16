/**
 * Region Types
 * Types for Indonesian region data (Province, City, District)
 */

import type { BaseResponse, MaybeRef, BaseComposableParams } from '../common/base.types'

// ============================================
// Region Entities
// ============================================

export interface Province {
  id: number
  name: string
}

export interface City {
  id: number
  name: string
  provinceId: number
}

export interface District {
  id: number
  name: string
  cityId: number
}

// ============================================
// Response Types
// ============================================

export type ProvinceListResponse = BaseResponse<Province[]>
export type CityListResponse = BaseResponse<City[]>
export type DistrictListResponse = BaseResponse<District[]>

// ============================================
// Request Parameters
// ============================================

export interface CityParams {
  provinceId: number
}

export interface DistrictParams {
  cityId: number
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useProvinces composable */
export type UseProvincesParams = BaseComposableParams

/** Parameters for useCities composable */
export type UseCitiesParams = BaseComposableParams<{
  provinceId?: MaybeRef<number | undefined>
}>

/** Parameters for useDistricts composable */
export type UseDistrictsParams = BaseComposableParams<{
  cityId?: MaybeRef<number | undefined>
}>
