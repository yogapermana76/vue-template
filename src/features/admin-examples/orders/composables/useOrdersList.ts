import { computed, ref } from 'vue'
import { useOrdersStore } from './useOrdersStore'
import type { Order, OrderStatusFilter } from '../types'

export function useOrdersList() {
  const store = useOrdersStore()

  const loading = ref(false)
  const selectedRows = ref<string[]>([])
  const statusFilter = ref<OrderStatusFilter>('all')
  const paymentFilter = ref<string>('all')
  const searchQuery = ref('')

  const filteredOrders = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return store.orders.value.filter(o => {
      if (statusFilter.value !== 'all' && o.status !== statusFilter.value) return false
      if (paymentFilter.value !== 'all' && o.paymentMethod !== paymentFilter.value) return false
      if (!q) return true
      return [o.id, o.customerName, o.customerEmail, o.shippingAddress, o.notes]
        .filter((v): v is string => typeof v === 'string' && v.length > 0)
        .some(v => v.toLowerCase().includes(q))
    })
  })

  const confirmOpen = ref(false)
  const deletingOrder = ref<Order | null>(null)
  const deleteLoading = ref(false)

  const openDelete = (order: Order) => {
    deletingOrder.value = order
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!deletingOrder.value) return
    deleteLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      store.deleteOrder(deletingOrder.value.id)
      confirmOpen.value = false
      deletingOrder.value = null
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    orders: store.orders,
    filteredOrders,
    loading,
    selectedRows,
    statusFilter,
    paymentFilter,
    searchQuery,

    confirmOpen,
    deletingOrder,
    deleteLoading,
    openDelete,
    confirmDelete,
  }
}
