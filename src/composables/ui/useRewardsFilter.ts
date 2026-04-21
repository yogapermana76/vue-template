/**
 * Rewards Filter Composable
 * Manages filter state for rewards sections with session persistence
 */

import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type { RemovableRef } from '@vueuse/core'

const STORAGE_KEY = 'rewards-category-filter'

/**
 * Composable for managing rewards category filter with persistence
 * Uses sessionStorage to maintain filter state across navigation
 *
 * @example
 * const { activeCategoryId, setCategory, categoryIdForApi } = useRewardsFilter()
 */
export function useRewardsFilter() {
  // Reactive session storage - auto-saves on change
  const activeCategoryId: RemovableRef<number | null> = useSessionStorage<number | null>(
    STORAGE_KEY,
    null,
  )

  /**
   * Set active category filter
   */
  const setCategory = (categoryId: number | null) => {
    activeCategoryId.value = categoryId
  }

  /**
   * Initialize filter with default category if not set
   */
  const initializeWithDefault = (defaultCategoryId: number | null) => {
    if (defaultCategoryId && !activeCategoryId.value) {
      activeCategoryId.value = defaultCategoryId
    }
  }

  /**
   * Convert null to undefined for API compatibility
   */
  const categoryIdForApi = computed(() => activeCategoryId.value ?? undefined)

  /**
   * Clear filter (reset to null)
   */
  const clearFilter = () => {
    activeCategoryId.value = null
  }

  return {
    activeCategoryId,
    categoryIdForApi,
    setCategory,
    initializeWithDefault,
    clearFilter,
  }
}
