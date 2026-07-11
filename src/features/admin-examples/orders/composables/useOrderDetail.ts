import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from './useOrdersStore'
import type { Order, OrderPaymentMethod, OrderStatus } from '../types'

interface OrderEditFormValues {
  customerName: string
  customerEmail: string
  status: OrderStatus
  paymentMethod: OrderPaymentMethod
  shippingAddress: string
  notes: string
}

const buildForm = (order: Order): OrderEditFormValues => ({
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  status: order.status,
  paymentMethod: order.paymentMethod,
  shippingAddress: order.shippingAddress,
  notes: order.notes ?? '',
})

export function useOrderDetail() {
  const store = useOrdersStore()
  const route = useRoute()
  const router = useRouter()

  const orderId = computed(
    () => (Array.isArray(route.params.id) ? route.params.id[0] : route.params.id) as string,
  )
  const order = computed(() => store.findOrder(orderId.value))

  const isEditing = ref(route.query.mode === 'edit')

  watch(
    () => route.query.mode,
    m => {
      isEditing.value = m === 'edit'
    },
  )

  const enterEdit = () => {
    router.replace({ query: { ...route.query, mode: 'edit' } })
    resetForm()
  }

  const exitEdit = () => {
    const { mode: _mode, ...rest } = route.query
    router.replace({ query: rest })
  }

  const form = ref<OrderEditFormValues>({
    customerName: '',
    customerEmail: '',
    status: 'pending',
    paymentMethod: 'card',
    shippingAddress: '',
    notes: '',
  })

  const resetForm = () => {
    if (order.value) form.value = buildForm(order.value)
  }

  watch(order, resetForm, { immediate: true })

  const saving = ref(false)
  const save = async () => {
    if (!order.value) return
    saving.value = true
    try {
      await new Promise(r => setTimeout(r, 400))
      store.updateOrder(order.value.id, { ...form.value })
      exitEdit()
    } finally {
      saving.value = false
    }
  }

  const confirmOpen = ref(false)
  const deleteLoading = ref(false)

  const openDelete = () => {
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!order.value) return
    deleteLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      store.deleteOrder(order.value.id)
      confirmOpen.value = false
      router.replace('/docs/admin-examples/orders')
    } finally {
      deleteLoading.value = false
    }
  }

  const back = () => router.push('/docs/admin-examples/orders')

  return {
    order,
    isEditing,
    enterEdit,
    exitEdit,
    form,
    saving,
    save,
    confirmOpen,
    deleteLoading,
    openDelete,
    confirmDelete,
    back,
  }
}

export type { OrderEditFormValues }
