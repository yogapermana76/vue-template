import { computed, ref, type Ref } from 'vue'
import type { LoketScanTicketItem } from '@/types/services/loket'

export const PREVIEW_LIMIT = 5

export function useTicketListView(
  source: () => LoketScanTicketItem[],
  externalQuery?: Ref<string>,
) {
  const query = externalQuery ?? ref('')
  const showAll = ref(false)

  const matchesQuery = (t: LoketScanTicketItem) => {
    const q = query.value.trim().toLowerCase()
    if (!q) return true
    return t.Fullname?.toLowerCase().includes(q) === true || t.TicketCode.toLowerCase().includes(q)
  }

  const filtered = computed(() => source().filter(matchesQuery))

  const displayed = computed(() =>
    showAll.value ? filtered.value : filtered.value.slice(0, PREVIEW_LIMIT),
  )

  const hasOverflow = computed(() => filtered.value.length > PREVIEW_LIMIT)

  const toggleShowAll = () => {
    showAll.value = !showAll.value
  }

  return {
    query,
    showAll,
    filtered,
    displayed,
    hasOverflow,
    toggleShowAll,
  }
}
