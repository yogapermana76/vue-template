/**
 * Lifestyle Voucher Store
 * Manages selected voucher state with automatic sessionStorage persistence
 *
 * Pattern: Composition API Pinia Store (following theme.ts pattern)
 * Persistence: useStorage from @vueuse/core
 */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { StorageSerializers, useStorage } from '@vueuse/core'

export interface SelectedVoucher {
  id: string
  code: string
  title: string
  discountAmount?: number
  discountPercentage?: number
}

/**
 * Lifestyle Voucher Store
 *
 * Features:
 * - Selected voucher state management
 * - Automatic sessionStorage persistence
 * - Reactive updates across components
 *
 * @example
 * ```ts
 * const voucherStore = useVoucherStore()
 *
 * // Set voucher
 * voucherStore.setVoucher({
 *   id: 'v1',
 *   code: 'DISCOUNT50',
 *   title: 'Diskon 50%',
 *   discountPercentage: 50
 * })
 *
 * // Get voucher
 * const voucher = voucherStore.selectedVoucher
 *
 * // Clear voucher
 * voucherStore.clearVoucher()
 * ```
 */
export const useVoucherStore = defineStore('lifestyle-voucher', () => {
  // Reactive state with automatic sessionStorage persistence
  const selectedVoucher = useStorage<SelectedVoucher | null>(
    'lifestyle_selected_voucher',
    null,
    sessionStorage,
    {
      mergeDefaults: true,
      serializer: StorageSerializers.object,
    },
  )

  // Computed getters
  const hasVoucher = computed(() => selectedVoucher.value !== null)

  // Actions

  /**
   * Set selected voucher
   */
  function setVoucher(voucher: SelectedVoucher) {
    selectedVoucher.value = voucher
  }

  /**
   * Clear selected voucher
   */
  function clearVoucher() {
    selectedVoucher.value = null
  }

  return {
    // State
    selectedVoucher,

    // Getters
    hasVoucher,

    // Actions
    setVoucher,
    clearVoucher,
  }
})
