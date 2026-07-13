import { reactive, ref } from 'vue'
import { SUBMISSION_STATUS_ORDER } from '../constants'
import type { SubmissionStatus } from '../types'

export interface SubmissionFilters {
  category: string | null
  keyword: string
}

const emptyFilters = (): SubmissionFilters => ({
  category: null,
  keyword: '',
})

/**
 * UI-side filter + selection state for the voucher-submission list.
 * Server-side concerns (rows, counts, quota) are fetched via TanStack Query
 * in the page — this composable only owns local state.
 */
export function useSubmissionList() {
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

  return {
    activeStatus,
    filters,
    selectedIds,
    statusOrder: SUBMISSION_STATUS_ORDER,
    setStatus,
    setKeyword,
    setCategory,
    resetFilters,
  }
}

export type UseSubmissionListReturn = ReturnType<typeof useSubmissionList>
