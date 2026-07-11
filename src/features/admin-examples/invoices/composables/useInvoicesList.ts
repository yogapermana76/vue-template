import { computed, ref } from 'vue'
import { useInvoicesStore } from './useInvoicesStore'
import type { Invoice, InvoiceStatusFilter } from '../types'

export function useInvoicesList() {
  const store = useInvoicesStore()

  const loading = ref(false)
  const selectedRows = ref<string[]>([])
  const statusFilter = ref<InvoiceStatusFilter>('all')
  const searchQuery = ref('')

  const filteredInvoices = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return store.invoices.value.filter(i => {
      if (statusFilter.value !== 'all' && i.status !== statusFilter.value) return false
      if (!q) return true
      return [i.number, i.clientName, i.clientEmail]
        .filter(Boolean)
        .some(v => v.toLowerCase().includes(q))
    })
  })

  const confirmOpen = ref(false)
  const deleting = ref<Invoice | null>(null)
  const deleteLoading = ref(false)

  const openDelete = (invoice: Invoice) => {
    deleting.value = invoice
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!deleting.value) return
    deleteLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 250))
      store.deleteInvoice(deleting.value.id)
      confirmOpen.value = false
      deleting.value = null
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    invoices: store.invoices,
    filteredInvoices,
    loading,
    selectedRows,
    statusFilter,
    searchQuery,

    confirmOpen,
    deleting,
    deleteLoading,
    openDelete,
    confirmDelete,
  }
}
