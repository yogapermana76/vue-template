import { computed, ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useMonitoring, useMonitoringExport, useTicketDetail } from '@/composables/services'
import type { Pagination } from '@/types/services'
import {
  emptyMonitoringFilters,
  toMonitoringParams,
  type MonitoringFilters,
  type MonitoringHeader,
  type MonitoringRow,
} from '../types'

const DEFAULT_PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 500

export function useMonitoringView(programIdRef: () => number | undefined) {
  const page = ref(1)
  const perPage = ref(DEFAULT_PAGE_SIZE)
  const filters = ref<MonitoringFilters>(emptyMonitoringFilters())

  const programId = computed(() => programIdRef())

  // Debounce at composable layer so display reads live keyword while API waits.
  const debouncedKeyword = refDebounced(
    computed(() => filters.value.keyword),
    SEARCH_DEBOUNCE_MS,
  )

  const listQuery = useMonitoring({
    query: {
      page,
      size: perPage,
      Keyword: debouncedKeyword,
      OrderStartDate: computed(() => filters.value.orderStartDate ?? undefined),
      OrderEndDate: computed(() => filters.value.orderEndDate ?? undefined),
      Claimed: computed(() => filters.value.claimed),
      ClaimedStartDate: computed(() => filters.value.claimedStartDate ?? undefined),
      ClaimedEndDate: computed(() => filters.value.claimedEndDate ?? undefined),
    },
    params: { programId },
  })

  // Force refetch on programId change: covers TanStack's "enabled false→true" miss.
  watch(programId, (next, prev) => {
    if (next && next !== prev) {
      page.value = 1
      listQuery.refetch()
    }
  })

  // Envelope: { data: rows[], header: [], pagination: {} } — all siblings.
  const headers = computed<MonitoringHeader[]>(() => listQuery.data.value?.header ?? [])
  const rows = computed<MonitoringRow[]>(() => listQuery.data.value?.data ?? [])
  const pagination = computed<Pagination | undefined>(() => listQuery.data.value?.pagination)
  const isLoading = computed(() => listQuery.isLoading.value || listQuery.isFetching.value)

  // Count of advanced (date range) filters — badges the "Filter" toolbar button.
  const activeFilterCount = computed(() => {
    const f = filters.value
    let n = 0
    if (f.orderStartDate) n++
    if (f.orderEndDate) n++
    if (f.claimedStartDate) n++
    if (f.claimedEndDate) n++
    return n
  })

  // True when ANY filter is active — drives empty-state wording.
  const hasAnyFilter = computed(() => {
    const f = filters.value
    return !!f.keyword || f.claimed !== undefined || activeFilterCount.value > 0
  })

  const filterOpen = ref(false)
  const openFilter = () => (filterOpen.value = true)
  const applyFilters = (next: MonitoringFilters) => {
    filters.value = next
    page.value = 1
    filterOpen.value = false
  }
  const resetFilters = () => {
    filters.value = emptyMonitoringFilters()
    page.value = 1
  }

  const goToPage = (nextPage: number) => {
    page.value = nextPage
  }
  const setPerPage = (size: number) => {
    perPage.value = size
    page.value = 1
  }
  const setKeyword = (keyword: string) => {
    filters.value = { ...filters.value, keyword }
    page.value = 1
  }
  const setClaimed = (claimed: boolean | undefined) => {
    filters.value = { ...filters.value, claimed }
    page.value = 1
  }

  const detailCode = ref<string | undefined>()
  const detailOpen = ref(false)
  const detailQuery = useTicketDetail({
    params: { programId, code: detailCode },
  })
  const detail = computed(() => detailQuery.data.value?.data)
  const isDetailLoading = computed(() => detailQuery.isLoading.value)

  const openDetail = (row: MonitoringRow) => {
    const code = String(row.TicketCode ?? row.Code ?? '')
    if (!code) return
    detailCode.value = code
    detailOpen.value = true
  }

  const exportMutation = useMonitoringExport()
  const isExporting = computed(() => exportMutation.isPending.value)

  const exportToExcel = async () => {
    const id = programId.value
    if (!id) return
    const params = toMonitoringParams(id, filters.value, page.value, perPage.value)
    const blob = await exportMutation.mutateAsync(params)
    downloadBlob(blob, `monitoring-${id}-${Date.now()}.xlsx`)
  }

  return {
    filters,
    filterOpen,
    openFilter,
    applyFilters,
    resetFilters,
    activeFilterCount,
    hasAnyFilter,
    headers,
    rows,
    pagination,
    isLoading,
    page,
    perPage,
    goToPage,
    setPerPage,
    setKeyword,
    setClaimed,
    detail,
    detailOpen,
    isDetailLoading,
    openDetail,
    isExporting,
    exportToExcel,
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
