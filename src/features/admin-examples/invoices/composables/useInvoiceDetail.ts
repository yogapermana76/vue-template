import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvoicesStore } from './useInvoicesStore'
import type { InvoiceStatus } from '../types'

export function useInvoiceDetail() {
  const store = useInvoicesStore()
  const route = useRoute('/docs/admin-examples/invoices/[id]')
  const router = useRouter()

  const invoiceId = computed(() => route.params.id)
  const invoice = computed(() => store.findInvoice(invoiceId.value))

  const back = () => router.push('/docs/admin-examples/invoices')

  const sending = ref(false)
  const markingPaid = ref(false)

  const sendInvoice = async () => {
    if (!invoice.value) return
    sending.value = true
    try {
      await new Promise(r => setTimeout(r, 400))
      const nextTimeline = [
        ...invoice.value.timeline,
        {
          id: invoice.value.timeline.length + 1,
          kind: 'sent' as const,
          label: 'Re-sent to client',
          timestamp: new Date().toISOString(),
          actor: 'John Doe',
        },
      ]
      store.updateInvoice(invoice.value.id, {
        status: 'sent' as InvoiceStatus,
        timeline: nextTimeline,
      })
    } finally {
      sending.value = false
    }
  }

  const markPaid = async () => {
    if (!invoice.value) return
    markingPaid.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const nextTimeline = [
        ...invoice.value.timeline,
        {
          id: invoice.value.timeline.length + 1,
          kind: 'paid' as const,
          label: 'Marked as paid',
          timestamp: new Date().toISOString(),
          actor: 'John Doe',
        },
      ]
      store.updateInvoice(invoice.value.id, {
        status: 'paid' as InvoiceStatus,
        timeline: nextTimeline,
      })
    } finally {
      markingPaid.value = false
    }
  }

  const voidInvoice = async () => {
    if (!invoice.value) return
    await new Promise(r => setTimeout(r, 200))
    store.updateInvoice(invoice.value.id, { status: 'void' as InvoiceStatus })
  }

  const confirmOpen = ref(false)
  const deleteLoading = ref(false)

  const openDelete = () => {
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!invoice.value) return
    deleteLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 250))
      store.deleteInvoice(invoice.value.id)
      confirmOpen.value = false
      router.replace('/docs/admin-examples/invoices')
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    invoice,
    back,
    sending,
    markingPaid,
    sendInvoice,
    markPaid,
    voidInvoice,
    confirmOpen,
    deleteLoading,
    openDelete,
    confirmDelete,
  }
}
