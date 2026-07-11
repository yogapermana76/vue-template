import { computed, ref } from 'vue'
import type { Voucher, VoucherFormValues, VoucherStatusFilter } from '../types'

const emptyForm = (): VoucherFormValues => ({
  code: '',
  description: '',
  kind: 'percentage',
  amount: 0,
  minSpend: 0,
  usageLimit: 100,
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: '',
  status: 'scheduled',
})

const seed = (): Voucher[] => [
  {
    id: 'VC-2026-01',
    code: 'SUMMER25',
    description: '25% off summer collection',
    kind: 'percentage',
    amount: 25,
    minSpend: 50,
    usageLimit: 500,
    usageCount: 187,
    startsAt: '2026-06-01',
    endsAt: '2026-07-31',
    status: 'active',
  },
  {
    id: 'VC-2026-02',
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    kind: 'shipping',
    amount: 0,
    minSpend: 30,
    usageLimit: 1000,
    usageCount: 620,
    startsAt: '2026-05-15',
    endsAt: '2026-08-15',
    status: 'active',
  },
  {
    id: 'VC-2026-03',
    code: 'WELCOME10',
    description: '$10 off first order',
    kind: 'fixed',
    amount: 10,
    minSpend: 25,
    usageLimit: 200,
    usageCount: 200,
    startsAt: '2026-01-01',
    endsAt: '2026-06-30',
    status: 'expired',
  },
  {
    id: 'VC-2026-04',
    code: 'FALL30',
    description: '30% off fall pre-orders',
    kind: 'percentage',
    amount: 30,
    minSpend: 75,
    usageLimit: 300,
    usageCount: 0,
    startsAt: '2026-09-01',
    endsAt: '2026-10-31',
    status: 'scheduled',
  },
  {
    id: 'VC-2026-05',
    code: 'LEGACY15',
    description: 'Old campaign — do not enable',
    kind: 'percentage',
    amount: 15,
    minSpend: 0,
    usageLimit: 100,
    usageCount: 47,
    startsAt: '2025-01-01',
    endsAt: '2025-12-31',
    status: 'disabled',
  },
]

export function useVouchersCrud() {
  const vouchers = ref<Voucher[]>(seed())
  const loading = ref(false)
  const selectedRows = ref<string[]>([])
  const statusFilter = ref<VoucherStatusFilter>('all')
  const kindFilter = ref<string>('all')
  const startDateFrom = ref<string>('')
  const startDateTo = ref<string>('')
  const searchQuery = ref('')

  const filteredVouchers = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return vouchers.value.filter(v => {
      if (statusFilter.value !== 'all' && v.status !== statusFilter.value) return false
      if (kindFilter.value !== 'all' && v.kind !== kindFilter.value) return false
      if (startDateFrom.value && v.startsAt < startDateFrom.value) return false
      if (startDateTo.value && v.startsAt > startDateTo.value) return false
      if (!q) return true
      return [v.id, v.code, v.description].filter(Boolean).some(x => x.toLowerCase().includes(q))
    })
  })

  const detailOpen = ref(false)
  const detailVoucher = ref<Voucher | null>(null)

  const openDetail = (voucher: Voucher) => {
    detailVoucher.value = voucher
    detailOpen.value = true
  }

  const formOpen = ref(false)
  const formMode = ref<'create' | 'edit'>('create')
  const formSaving = ref(false)
  const editingId = ref<string | null>(null)
  const form = ref<VoucherFormValues>(emptyForm())

  const openCreate = () => {
    formMode.value = 'create'
    editingId.value = null
    form.value = emptyForm()
    formOpen.value = true
  }

  const openEdit = (voucher: Voucher) => {
    formMode.value = 'edit'
    editingId.value = voucher.id
    form.value = {
      code: voucher.code,
      description: voucher.description,
      kind: voucher.kind,
      amount: voucher.amount,
      minSpend: voucher.minSpend,
      usageLimit: voucher.usageLimit,
      startsAt: voucher.startsAt,
      endsAt: voucher.endsAt,
      status: voucher.status,
    }
    formOpen.value = true
  }

  const submitForm = async () => {
    formSaving.value = true
    try {
      await new Promise(r => setTimeout(r, 400))
      if (formMode.value === 'create') {
        const seq = vouchers.value.length + 1
        const id = `VC-2026-${String(seq).padStart(2, '0')}`
        vouchers.value.unshift({
          id,
          ...form.value,
          usageCount: 0,
        })
      } else if (editingId.value != null) {
        const idx = vouchers.value.findIndex(v => v.id === editingId.value)
        if (idx !== -1) vouchers.value[idx] = { ...vouchers.value[idx], ...form.value }
      }
      formOpen.value = false
    } finally {
      formSaving.value = false
    }
  }

  const bulkLoading = ref(false)
  const bulkDisable = async () => {
    bulkLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const ids = new Set(selectedRows.value)
      vouchers.value = vouchers.value.map(v =>
        ids.has(v.id) ? { ...v, status: 'disabled' as const } : v,
      )
      selectedRows.value = []
    } finally {
      bulkLoading.value = false
    }
  }

  const bulkDelete = async () => {
    bulkLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const ids = new Set(selectedRows.value)
      vouchers.value = vouchers.value.filter(v => !ids.has(v.id))
      selectedRows.value = []
    } finally {
      bulkLoading.value = false
    }
  }

  const confirmOpen = ref(false)
  const deleting = ref<Voucher | null>(null)
  const deleteLoading = ref(false)

  const openDelete = (voucher: Voucher) => {
    deleting.value = voucher
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!deleting.value) return
    deleteLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 250))
      vouchers.value = vouchers.value.filter(v => v.id !== deleting.value!.id)
      confirmOpen.value = false
      deleting.value = null
    } finally {
      deleteLoading.value = false
    }
  }

  const exportCsv = () => {
    const rows = filteredVouchers.value.map(v =>
      [v.id, v.code, v.kind, v.amount, v.startsAt, v.endsAt, v.status].join(','),
    )
    const csv = `id,code,kind,amount,startsAt,endsAt,status\n${rows.join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vouchers-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    vouchers,
    filteredVouchers,
    loading,
    selectedRows,
    statusFilter,
    kindFilter,
    startDateFrom,
    startDateTo,
    searchQuery,

    detailOpen,
    detailVoucher,
    openDetail,

    formOpen,
    formMode,
    formSaving,
    form,
    openCreate,
    openEdit,
    submitForm,

    bulkLoading,
    bulkDisable,
    bulkDelete,

    confirmOpen,
    deleting,
    deleteLoading,
    openDelete,
    confirmDelete,

    exportCsv,
  }
}
