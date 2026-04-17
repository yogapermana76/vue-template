/**
 * Region Types
 * Types for Indonesian region data (Province, City, District)
 */

import type { BaseResponse, MaybeRef, BaseComposableParams } from '../common/base.types'

// ============================================
// Region Entities
// ============================================

/**
 * Province entity
 * @property {string} id - Province ID (always string for consistency)
 * @property {string} name - Province name
 */
export interface Province {
  id: string
  name: string
}

/**
 * City entity
 * @property {string} id - City ID (always string for consistency)
 * @property {string} name - City name
 * @property {string} provinceId - Parent province ID
 */
export interface City {
  id: string
  name: string
  provinceId: string
}

/**
 * District entity
 * @property {string} id - District ID (always string for consistency)
 * @property {string} name - District name
 * @property {string} cityId - Parent city ID
 */
export interface District {
  id: string
  name: string
  cityId: string
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
  provinceId: string
}

export interface DistrictParams {
  cityId: string
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useProvinces composable */
export type UseProvincesParams = BaseComposableParams

/** Parameters for useCities composable */
export type UseCitiesParams = BaseComposableParams<{
  provinceId?: MaybeRef<string | undefined>
}>

/** Parameters for useDistricts composable */
export type UseDistrictsParams = BaseComposableParams<{
  cityId?: MaybeRef<string | undefined>
}>
