import { computed, reactive, watch, type MaybeRefOrGetter, toValue } from 'vue'
import type { VoucherCategory } from '../types'

export function useVoucherRequest(source: MaybeRefOrGetter<VoucherCategory[]>) {
  const categories = computed(() => toValue(source))
  const quantities = reactive<Record<string, number>>({})

  // Sync quantities dict with the current categories: add new ids at 0, drop old ones.
  // Watch a stable id signature — the source array may re-emit new references
  // for identical content (query refetches), and we don't want that to wipe
  // user-selected quantities. Skip empty signatures (loading/refetch flash).
  watch(
    () => categories.value.map(c => c.id).join('|'),
    signature => {
      if (!signature) return
      const next = categories.value
      const keep = new Set(next.map(c => c.id))
      for (const key of Object.keys(quantities)) {
        if (!keep.has(key)) delete quantities[key]
      }
      for (const c of next) {
        if (!(c.id in quantities)) quantities[c.id] = 0
      }
    },
    { immediate: true },
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
