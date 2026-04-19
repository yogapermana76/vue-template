/**
 * Region Composables
 * Using TanStack Query for Indonesian region data
 *
 * Pattern: Object Parameters
 * - All functions use object parameters for clarity and extensibility
 * - MaybeRef<T> supports both reactive and non-reactive values
 * - Separation of concerns: params (path), query (pagination/filter), options (query config)
 *
 * CRITICAL: Required for all address forms (exchange, redeem)
 */

import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { regionService } from '@/services'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type { UseProvincesParams, UseCitiesParams, UseDistrictsParams } from '@/types'

// ============================================
// Query Keys
// ============================================

export const regionKeys = {
  all: ['region'] as const,
  provinces: () => [...regionKeys.all, 'provinces'] as const,
  cities: (provinceId?: string) => [...regionKeys.all, 'cities', provinceId] as const,
  districts: (cityId?: string) => [...regionKeys.all, 'districts', cityId] as const,
}

// ============================================
// Queries
// ============================================

/**
 * Get all provinces in Indonesia
 */
export function useProvinces(params: UseProvincesParams = {}) {
  const { options = {} } = params

  const authStore = useAuthStore()

  const defaultEnabled = computed(() => authStore.isAuthenticated)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: regionKeys.provinces(),
    queryFn: () => regionService.provinces(),
    staleTime: options.staleTime ?? config.cache.longStaleTime ?? 1000 * 60 * 60, // 1 hour (region data rarely changes)
    enabled: resolvedEnabled,
  })
}

/**
 * Get cities by province ID
 */
export function useCities(params: UseCitiesParams = {}) {
  const { query = {}, options = {} } = params
  const { provinceId } = query

  const authStore = useAuthStore()
  const resolvedProvinceId = computed(() => unref(provinceId))

  const defaultEnabled = computed(() => authStore.isAuthenticated && !!resolvedProvinceId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => regionKeys.cities(resolvedProvinceId.value)),
    queryFn: () => regionService.cities({ provinceId: resolvedProvinceId.value! }),
    staleTime: options.staleTime ?? config.cache.longStaleTime ?? 1000 * 60 * 60, // 1 hour
    enabled: resolvedEnabled,
  })
}

/**
 * Get districts by city ID
 */
export function useDistricts(params: UseDistrictsParams = {}) {
  const { query = {}, options = {} } = params
  const { cityId } = query

  const authStore = useAuthStore()
  const resolvedCityId = computed(() => unref(cityId))

  const defaultEnabled = computed(() => authStore.isAuthenticated && !!resolvedCityId.value)
  const resolvedEnabled = computed(() =>
    options.enabled !== undefined
      ? unref(options.enabled) && defaultEnabled.value
      : defaultEnabled.value,
  )

  return useQuery({
    queryKey: computed(() => regionKeys.districts(resolvedCityId.value)),
    queryFn: () => regionService.districts({ cityId: resolvedCityId.value! }),
    staleTime: options.staleTime ?? config.cache.longStaleTime ?? 1000 * 60 * 60, // 1 hour
    enabled: resolvedEnabled,
  })
}
