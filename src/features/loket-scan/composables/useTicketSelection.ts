import { computed, watch } from 'vue'
import type { LoketScanResult } from '@/types/services/loket'

export function useTicketSelection(options: {
  scanResult: () => LoketScanResult | undefined | null
  getSelected: () => string[]
  setSelected: (codes: string[]) => void
}) {
  const { scanResult, getSelected, setSelected } = options

  const unclaimed = computed(() => scanResult()?.Unclaimed ?? [])
  const claimed = computed(() => scanResult()?.Claimed ?? [])
  const claimableTickets = computed(() => unclaimed.value.filter(t => t.Claimable))
  const hasClaimable = computed(() => claimableTickets.value.length > 0)

  // Stable key per payload; empty when nothing loaded.
  const orderKey = computed(() => {
    const order = scanResult()?.Order
    return String(order?.OrderId ?? order?.OrderNumber ?? '')
  })

  watch(
    orderKey,
    key => {
      if (!key) return
      // Only overwrite when parent selection is empty (respect in-flight choices).
      if (getSelected().length === 0) {
        setSelected(claimableTickets.value.map(t => t.TicketCode))
      }
    },
    { immediate: true },
  )

  const selectedSet = computed(() => new Set(getSelected()))
  const isSelected = (code: string) => selectedSet.value.has(code)

  const toggleTicket = (code: string) => {
    const next = new Set(selectedSet.value)
    if (next.has(code)) next.delete(code)
    else next.add(code)
    setSelected(Array.from(next))
  }

  const toggleAll = (scope?: string[]) => {
    const targets = scope ?? claimableTickets.value.map(t => t.TicketCode)
    const allSelected = targets.every(c => selectedSet.value.has(c))
    const next = new Set(selectedSet.value)
    if (allSelected) targets.forEach(c => next.delete(c))
    else targets.forEach(c => next.add(c))
    setSelected(Array.from(next))
  }

  const isAllSelected = (codes: string[]) =>
    codes.length > 0 && codes.every(c => selectedSet.value.has(c))

  return {
    unclaimed,
    claimed,
    claimableTickets,
    hasClaimable,
    selectedSet,
    isSelected,
    toggleTicket,
    toggleAll,
    isAllSelected,
  }
}
