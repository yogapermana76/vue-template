/**
 * Region Service
 * Handles Indonesian region data API calls (requires auth)
 * CRITICAL: Required for all address forms (exchange, redeem)
 *
 * Data Normalization:
 * - All IDs are normalized to strings for consistency
 * - This ensures type safety throughout the application
 * - If API returns numeric IDs, they are converted to strings here
 */

import { http } from './http'
import { RegionEndpoint } from './endpoints'
import type {
  ProvinceListResponse,
  CityListResponse,
  DistrictListResponse,
  CityParams,
  DistrictParams,
  Province,
  City,
  District,
} from '@/types'

/**
 * Normalize province data to ensure ID is always a string
 */
function normalizeProvince(province: Province): Province {
  return {
    ...province,
    id: String(province.id),
  }
}

/**
 * Normalize city data to ensure IDs are always strings
 */
function normalizeCity(city: City): City {
  return {
    ...city,
    id: String(city.id),
    provinceId: String(city.provinceId),
  }
}

/**
 * Normalize district data to ensure IDs are always strings
 */
function normalizeDistrict(district: District): District {
  return {
    ...district,
    id: String(district.id),
    cityId: String(district.cityId),
  }
}

export const regionService = {
  /**
   * Get all provinces in Indonesia
   * Returns normalized data with string IDs
   */
  async provinces(): Promise<ProvinceListResponse> {
    const { data } = await http.get<ProvinceListResponse>(RegionEndpoint.PROVINCE)
    return {
      ...data,
      data: data.data.map(normalizeProvince),
    }
  },

  /**
   * Get cities by province ID
   * Returns normalized data with string IDs
   */
  async cities(params: CityParams): Promise<CityListResponse> {
    const { data } = await http.get<CityListResponse>(RegionEndpoint.CITY, { params })
    return {
      ...data,
      data: data.data.map(normalizeCity),
    }
  },

  /**
   * Get districts by city ID
   * Returns normalized data with string IDs
   */
  async districts(params: DistrictParams): Promise<DistrictListResponse> {
    const { data } = await http.get<DistrictListResponse>(RegionEndpoint.DISTRICT, { params })
    return {
      ...data,
      data: data.data.map(normalizeDistrict),
    }
  },
}
