/**
 * Region Service
 * Handles Indonesian region data API calls (requires auth)
 * CRITICAL: Required for all address forms (exchange, redeem)
 */

import { http } from './http'
import { RegionEndpoint } from './endpoints'
import type {
  ProvinceListResponse,
  CityListResponse,
  DistrictListResponse,
  CityParams,
  DistrictParams,
} from '@/types'

export const regionService = {
  /**
   * Get all provinces in Indonesia
   */
  async provinces(): Promise<ProvinceListResponse> {
    const { data } = await http.get<ProvinceListResponse>(RegionEndpoint.PROVINCE)
    return data
  },

  /**
   * Get cities by province ID
   */
  async cities(params: CityParams): Promise<CityListResponse> {
    const { data } = await http.get<CityListResponse>(RegionEndpoint.CITY, { params })
    return data
  },

  /**
   * Get districts by city ID
   */
  async districts(params: DistrictParams): Promise<DistrictListResponse> {
    const { data } = await http.get<DistrictListResponse>(RegionEndpoint.DISTRICT, { params })
    return data
  },
}
