/**
 * Voucher Category Filter Composable
 * Centralized reactive state untuk voucher category filter
 * Digunakan oleh parent page dan child components untuk sync state
 *
 * @example
 * // Di parent page
 * const { activeCategoryId } = useVoucherCategoryFilter()
 * const { total: voucherBadgeCount } = useVoucherPagesInfinite({
 *   query: { size: 1, categoryId: activeCategoryId }
 * })
 *
 * @example
 * // Di child component
 * const { activeCategoryId } = useVoucherCategoryFilter()
 * // Ketika user memilih kategori, state automatically update di parent juga
 */

import { ref, computed, readonly } from 'vue'

// Shared reactive state
const _activeCategoryId = ref<number | null>(null)

/**
 * Use voucher category filter state
 * Returns reactive category ID yang di-share across parent dan child components
 */
export function useVoucherCategoryFilter() {
  /**
   * Computed untuk API call (convert null ke undefined)
   * Berguna untuk `useVoucherPagesInfinite` yang expect `categoryId?: number`
   */
  const categoryIdForApi = computed(() => _activeCategoryId.value ?? undefined)

  /**
   * Computed untuk filter display (string-based untuk pills)
   * Berguna untuk `ScrollablePillTabs` yang expect string-based v-model
   */
  const activeFilterKey = computed({
    get: () => (_activeCategoryId.value !== null ? String(_activeCategoryId.value) : 'all'),
    set: (value: string) => {
      _activeCategoryId.value = value === 'all' ? null : Number(value)
    },
  })

  /**
   * Reset category ke default (semua)
   */
  const resetCategory = () => {
    _activeCategoryId.value = null
  }

  return {
    // Raw reactive ref untuk direct access
    activeCategoryId: readonly(_activeCategoryId),
    // Computed untuk API call
    categoryIdForApi,
    // Computed untuk pill tabs display
    activeFilterKey,
    // Helper function
    resetCategory,
    // Internal ref untuk update (gunakan activeFilterKey computed setter untuk safety)
    _activeCategoryId,
  }
}
