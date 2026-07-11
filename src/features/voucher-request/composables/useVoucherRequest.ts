import { computed, reactive } from 'vue'
import { VOUCHER_CATEGORIES } from '../constants'
import type { VoucherCategory } from '../types'

export function useVoucherRequest(categories: VoucherCategory[] = VOUCHER_CATEGORIES) {
  const quantities = reactive<Record<string, number>>(
    Object.fromEntries(categories.map(c => [c.id, 0])),
  )

  const totalVouchers = computed(() => Object.values(quantities).reduce((sum, n) => sum + n, 0))

  const hasSelection = computed(() => totalVouchers.value > 0)

  const setQuantity = (id: string, value: number) => {
    if (!(id in quantities)) return
    quantities[id] = Math.max(0, value)
  }

  const reset = () => {
    for (const id of Object.keys(quantities)) quantities[id] = 0
  }

  return {
    categories,
    quantities,
    totalVouchers,
    hasSelection,
    setQuantity,
    reset,
  }
}
