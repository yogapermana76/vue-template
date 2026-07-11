import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from './useOrdersStore'
import type { OrderFormValues, OrderItem } from '../types'

const emptyItem = (id: number): OrderItem => ({
  id,
  productName: '',
  sku: '',
  qty: 1,
  price: 0,
})

const emptyForm = (): OrderFormValues => ({
  customerName: '',
  customerEmail: '',
  status: 'pending',
  paymentMethod: 'card',
  shippingAddress: '',
  notes: '',
  items: [emptyItem(1)],
})

export function useOrderCreate() {
  const store = useOrdersStore()
  const router = useRouter()

  const form = ref<OrderFormValues>(emptyForm())

  const addItem = () => {
    const nextId = Math.max(0, ...form.value.items.map(i => i.id)) + 1
    form.value.items.push(emptyItem(nextId))
  }

  const removeItem = (id: number) => {
    if (form.value.items.length <= 1) return
    form.value.items = form.value.items.filter(i => i.id !== id)
  }

  const total = () => form.value.items.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0)

  const saving = ref(false)
  const submit = async () => {
    saving.value = true
    try {
      await new Promise(r => setTimeout(r, 400))
      const created = store.createOrder({ ...form.value })
      router.replace(`/docs/admin-examples/orders/${created.id}`)
    } finally {
      saving.value = false
    }
  }

  const cancel = () => router.push('/docs/admin-examples/orders')

  return {
    form,
    addItem,
    removeItem,
    total,
    saving,
    submit,
    cancel,
  }
}
