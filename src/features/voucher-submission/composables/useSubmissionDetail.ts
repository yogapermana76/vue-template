import { computed, ref, watch } from 'vue'
import { MOCK_SUBMISSION_LIST, buildMockDetail } from '../mocks/data'
import type { SubmissionDetail, SubmissionStatus } from '../types'

export function useSubmissionDetail(idRef: () => string | undefined) {
  const detail = ref<SubmissionDetail | null>(null)
  const isLoading = ref(false)

  const load = (id: string | undefined) => {
    if (!id) {
      detail.value = null
      return
    }
    isLoading.value = true
    // Simulated async — replace with real API call later.
    setTimeout(() => {
      const row = MOCK_SUBMISSION_LIST.find(r => r.id === id)
      detail.value = row ? buildMockDetail(row) : null
      isLoading.value = false
    }, 200)
  }

  watch(idRef, load, { immediate: true })

  const status = computed<SubmissionStatus | null>(() => detail.value?.status ?? null)

  const approveWithQuantities = (approvedByType: Record<string, number>) => {
    if (!detail.value) return
    detail.value = {
      ...detail.value,
      status: 'approved',
      quantities: detail.value.quantities.map(q => ({
        ...q,
        approved: approvedByType[q.id] ?? q.approved ?? 0,
      })),
    }
  }

  const reject = () => {
    if (!detail.value) return
    detail.value = { ...detail.value, status: 'rejected' }
  }

  const releaseVoucher = (code: string) => {
    if (!detail.value) return
    detail.value = {
      ...detail.value,
      vouchers: detail.value.vouchers.map(v => (v.code === code ? { ...v, status: 'unused' } : v)),
    }
  }

  return {
    detail,
    isLoading,
    status,
    approveWithQuantities,
    reject,
    releaseVoucher,
  }
}
