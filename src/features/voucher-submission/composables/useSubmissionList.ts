import { computed, reactive, ref } from 'vue'
import { MOCK_QUOTA_GROUPS, MOCK_SUBMISSION_LIST } from '../mocks/data'
import { SUBMISSION_STATUS_ORDER } from '../constants'
import type { SubmissionRow, SubmissionStatus } from '../types'

export interface SubmissionFilters {
  category: string | null
  keyword: string
}

const emptyFilters = (): SubmissionFilters => ({
  category: null,
  keyword: '',
})

export function useSubmissionList() {
  const rows = ref<SubmissionRow[]>([...MOCK_SUBMISSION_LIST])
  const quotaGroups = ref([...MOCK_QUOTA_GROUPS])

  const activeStatus = ref<SubmissionStatus>('pending')
  const filters = reactive<SubmissionFilters>(emptyFilters())
  const selectedIds = ref<string[]>([])

  const setStatus = (status: SubmissionStatus) => {
    if (activeStatus.value === status) return
    activeStatus.value = status
    selectedIds.value = []
  }

  const setKeyword = (v: string) => (filters.keyword = v)
  const setCategory = (v: string | null) => (filters.category = v)
  const resetFilters = () => Object.assign(filters, emptyFilters())

  const statusCounts = computed<Record<SubmissionStatus, number>>(() => {
    const counts = { approved: 0, pending: 0, rejected: 0 } as Record<SubmissionStatus, number>
    for (const r of rows.value) counts[r.status]++
    return counts
  })

  const filteredRows = computed(() => {
    const q = filters.keyword.trim().toLowerCase()
    return rows.value.filter(r => {
      if (r.status !== activeStatus.value) return false
      if (filters.category && r.category !== filters.category) return false
      if (
        q &&
        !r.id.toLowerCase().includes(q) &&
        !r.name.toLowerCase().includes(q) &&
        !r.phone.includes(q)
      ) {
        return false
      }
      return true
    })
  })

  const selectableIds = computed(() => filteredRows.value.map(r => r.id))
  const allSelected = computed(
    () =>
      selectableIds.value.length > 0 &&
      selectableIds.value.every(id => selectedIds.value.includes(id)),
  )
  const someSelected = computed(() => selectedIds.value.length > 0 && !allSelected.value)

  const toggleAll = () => {
    if (allSelected.value) selectedIds.value = []
    else selectedIds.value = [...selectableIds.value]
  }

  const toggleRow = (id: string) => {
    const idx = selectedIds.value.indexOf(id)
    if (idx === -1) selectedIds.value = [...selectedIds.value, id]
    else selectedIds.value = selectedIds.value.filter(x => x !== id)
  }

  const isSelected = (id: string) => selectedIds.value.includes(id)

  // Mock mutation — real API later.
  const approve = (ids: string[]) => {
    rows.value = rows.value.map(r => (ids.includes(r.id) ? { ...r, status: 'approved' } : r))
    selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
  }
  const reject = (ids: string[]) => {
    rows.value = rows.value.map(r => (ids.includes(r.id) ? { ...r, status: 'rejected' } : r))
    selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
  }

  return {
    // state
    rows,
    quotaGroups,
    activeStatus,
    filters,
    selectedIds,
    // derived
    statusCounts,
    statusOrder: SUBMISSION_STATUS_ORDER,
    filteredRows,
    selectableIds,
    allSelected,
    someSelected,
    // actions
    setStatus,
    setKeyword,
    setCategory,
    resetFilters,
    toggleAll,
    toggleRow,
    isSelected,
    approve,
    reject,
  }
}

export type UseSubmissionListReturn = ReturnType<typeof useSubmissionList>
