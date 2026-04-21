/**
 * Location Picker Composable
 * Business logic for location selection (Province -> City -> District)
 *
 * Type Consistency:
 * - All IDs (province, city, district) use STRING type
 * - This matches the API response format and ensures consistency
 * - The region service normalizes all IDs to strings
 * - All comparisons use strict equality (===) for type safety
 */

import { ref, computed } from 'vue'
import { useProvinces, useCities, useDistricts } from '@/composables/services/useRegion'
import type { Province, City, District } from '@/types'
import type {
  LocationLevel,
  LocationItem,
  LocationGroup,
  SelectedLocation,
} from '@/components/shared/location-picker/types'
import { SEARCH_PLACEHOLDERS, SECTION_TITLES } from '@/components/shared/location-picker/constants'

export interface UseLocationPickerParams {
  /** Initial selected location (all IDs must be strings) */
  initialSelection?: SelectedLocation
}

export function useLocationPicker(params: UseLocationPickerParams = {}) {
  const { initialSelection } = params

  // ============================================
  // State
  // ============================================

  const searchQuery = ref('')
  const selectedProvinceId = ref<string | undefined>(initialSelection?.provinceId)
  const selectedCityId = ref<string | undefined>(initialSelection?.cityId)
  const selectedDistrictId = ref<string | undefined>(initialSelection?.districtId)

  // Track which level is being edited (to show list without resetting)
  const editingLevel = ref<LocationLevel | null>(null)

  // ============================================
  // Data Fetching
  // ============================================

  const {
    data: provincesData,
    isLoading: isLoadingProvinces,
    isError: isErrorProvinces,
  } = useProvinces()

  const {
    data: citiesData,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useCities({
    query: { provinceId: selectedProvinceId },
  })

  const {
    data: districtsData,
    isLoading: isLoadingDistricts,
    isError: isErrorDistricts,
  } = useDistricts({
    query: { cityId: selectedCityId },
  })

  // ============================================
  // Computed - Current Level
  // ============================================

  const currentLevel = computed<LocationLevel>(() => {
    // If editing a specific level, show that level
    if (editingLevel.value) return editingLevel.value

    // Otherwise, determine level based on selections
    if (!selectedProvinceId.value) return 'province'
    if (!selectedCityId.value) return 'city'
    return 'district'
  })

  // ============================================
  // Computed - Data Lists
  // ============================================

  const provinces = computed<Province[]>(() => provincesData.value?.data || [])
  const cities = computed<City[]>(() => citiesData.value?.data || [])
  const districts = computed<District[]>(() => districtsData.value?.data || [])

  // ============================================
  // Computed - Current Data
  // ============================================

  const currentData = computed<LocationItem[]>(() => {
    switch (currentLevel.value) {
      case 'province':
        return provinces.value
      case 'city':
        return cities.value
      case 'district':
        return districts.value
      default:
        return []
    }
  })

  // ============================================
  // Computed - Filtered Data
  // ============================================

  const filteredData = computed<LocationItem[]>(() => {
    if (!searchQuery.value) return currentData.value

    const query = searchQuery.value.toLowerCase()
    return currentData.value.filter(item => item.name.toLowerCase().includes(query))
  })

  // ============================================
  // Computed - Grouped Data
  // ============================================

  const groupedData = computed<LocationGroup[]>(() => {
    const groups: Record<string, LocationItem[]> = {}

    filteredData.value.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(item)
    })

    // Sort groups alphabetically
    return Object.keys(groups)
      .sort()
      .map(letter => ({
        letter,
        items: groups[letter].sort((a, b) => a.name.localeCompare(b.name)),
      }))
  })

  // ============================================
  // Computed - Selected Names
  // ============================================

  const selectedProvinceName = computed<string>(() => {
    if (!selectedProvinceId.value) return ''
    return provinces.value.find(p => p.id === selectedProvinceId.value)?.name || ''
  })

  const selectedCityName = computed<string>(() => {
    if (!selectedCityId.value) return ''
    return cities.value.find(c => c.id === selectedCityId.value)?.name || ''
  })

  const selectedDistrictName = computed<string>(() => {
    if (!selectedDistrictId.value) return ''
    return districts.value.find(d => d.id === selectedDistrictId.value)?.name || ''
  })

  // ============================================
  // Computed - Selected ID (for current level)
  // ============================================

  const selectedId = computed<string | undefined>(() => {
    switch (currentLevel.value) {
      case 'province':
        return selectedProvinceId.value
      case 'city':
        return selectedCityId.value
      case 'district':
        return selectedDistrictId.value
      default:
        return undefined
    }
  })

  // ============================================
  // Computed - Loading & Error States
  // ============================================

  const isLoading = computed(() => {
    switch (currentLevel.value) {
      case 'province':
        return isLoadingProvinces.value
      case 'city':
        return isLoadingCities.value
      case 'district':
        return isLoadingDistricts.value
      default:
        return false
    }
  })

  const isError = computed(() => {
    switch (currentLevel.value) {
      case 'province':
        return isErrorProvinces.value
      case 'city':
        return isErrorCities.value
      case 'district':
        return isErrorDistricts.value
      default:
        return false
    }
  })

  // ============================================
  // Computed - Can Save
  // ============================================

  const canSave = computed(() => {
    // Need province, city, and district all selected
    return !!(selectedProvinceId.value && selectedCityId.value && selectedDistrictId.value)
  })

  // ============================================
  // Computed - Search Placeholder
  // ============================================

  const searchPlaceholder = computed(() => SEARCH_PLACEHOLDERS[currentLevel.value])

  // ============================================
  // Computed - Section Title
  // ============================================

  const sectionTitle = computed(() => SECTION_TITLES[currentLevel.value])

  // ============================================
  // Methods - Selection
  // ============================================

  const handleSelect = (id: string) => {
    switch (currentLevel.value) {
      case 'province':
        // Only reset child fields if selecting different province
        if (selectedProvinceId.value !== id) {
          selectedCityId.value = undefined
          selectedDistrictId.value = undefined
        }
        selectedProvinceId.value = id
        break
      case 'city':
        // Only reset child fields if selecting different city
        if (selectedCityId.value !== id) {
          selectedDistrictId.value = undefined
        }
        selectedCityId.value = id
        break
      case 'district':
        selectedDistrictId.value = id
        break
    }

    // Clear editing mode after selection
    editingLevel.value = null

    // Reset search on selection
    searchQuery.value = ''
  }

  const handleReset = () => {
    selectedProvinceId.value = undefined
    selectedCityId.value = undefined
    selectedDistrictId.value = undefined
    editingLevel.value = null
    searchQuery.value = ''
  }

  const handleEditProvince = () => {
    // Set editing mode to show province list (don't reset yet)
    editingLevel.value = 'province'
    searchQuery.value = ''
  }

  const handleEditCity = () => {
    // Set editing mode to show city list (don't reset yet)
    editingLevel.value = 'city'
    searchQuery.value = ''
  }

  const handleEditDistrict = () => {
    // Set editing mode to show district list (don't reset yet)
    editingLevel.value = 'district'
    searchQuery.value = ''
  }

  const getSelectedLocation = (): SelectedLocation => {
    return {
      provinceId: selectedProvinceId.value,
      cityId: selectedCityId.value,
      districtId: selectedDistrictId.value,
    }
  }

  // ============================================
  // Return
  // ============================================

  return {
    // State
    searchQuery,
    selectedProvinceId,
    selectedCityId,
    selectedDistrictId,
    editingLevel,

    // Current level
    currentLevel,

    // Data
    groupedData,
    selectedId,

    // Selected names
    selectedProvinceName,
    selectedCityName,
    selectedDistrictName,

    // Loading & error
    isLoading,
    isError,

    // Validation
    canSave,

    // UI helpers
    searchPlaceholder,
    sectionTitle,

    // Methods
    handleSelect,
    handleReset,
    handleEditProvince,
    handleEditCity,
    handleEditDistrict,
    getSelectedLocation,
  }
}
