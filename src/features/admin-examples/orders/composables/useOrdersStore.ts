import { ref } from 'vue'
import type { Order, OrderFormValues } from '../types'

const seed = (): Order[] => [
  {
    id: 'ORD-2026-0001',
    customerName: 'Ayu Pertiwi',
    customerEmail: 'ayu.pertiwi@example.com',
    status: 'paid',
    paymentMethod: 'card',
    totalAmount: 259.98,
    itemsCount: 2,
    items: [
      { id: 1, productName: 'Wireless Headphones', sku: 'WH-001', qty: 1, price: 79.99 },
      { id: 2, productName: 'Smart Watch', sku: 'SW-002', qty: 1, price: 179.99 },
    ],
    shippingAddress: 'Jl. Merdeka No. 12, Bandung',
    notes: 'Leave at doorstep',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-02',
  },
  {
    id: 'ORD-2026-0002',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',
    status: 'pending',
    paymentMethod: 'transfer',
    totalAmount: 89.98,
    itemsCount: 2,
    items: [
      { id: 1, productName: 'Yoga Mat', sku: 'YM-004', qty: 2, price: 29.99 },
      { id: 2, productName: 'Water Bottle', sku: 'WB-006', qty: 1, price: 29.99 },
    ],
    shippingAddress: 'Jl. Sudirman No. 45, Jakarta',
    createdAt: '2026-07-03',
    updatedAt: '2026-07-03',
  },
  {
    id: 'ORD-2026-0003',
    customerName: 'Citra Wijaya',
    customerEmail: 'citra.wijaya@example.com',
    status: 'shipped',
    paymentMethod: 'ewallet',
    totalAmount: 34.99,
    itemsCount: 1,
    items: [{ id: 1, productName: 'Desk Lamp', sku: 'DL-005', qty: 1, price: 34.99 }],
    shippingAddress: 'Jl. Gatot Subroto No. 8, Surabaya',
    createdAt: '2026-06-28',
    updatedAt: '2026-07-01',
  },
  {
    id: 'ORD-2026-0004',
    customerName: 'Dimas Prasetya',
    customerEmail: 'dimas.prasetya@example.com',
    status: 'cancelled',
    paymentMethod: 'card',
    totalAmount: 44.99,
    itemsCount: 1,
    items: [{ id: 1, productName: 'Gaming Mouse', sku: 'GM-010', qty: 1, price: 44.99 }],
    shippingAddress: 'Jl. Diponegoro No. 33, Semarang',
    notes: 'Customer requested cancellation',
    createdAt: '2026-06-25',
    updatedAt: '2026-06-26',
  },
]

const orders = ref<Order[]>(seed())

const findOrder = (id: string) => orders.value.find(o => o.id === id) ?? null

const updateOrder = (id: string, values: Partial<Order>) => {
  const idx = orders.value.findIndex(o => o.id === id)
  if (idx === -1) return null
  const nextItems = values.items ?? orders.value[idx].items
  const totalAmount = Number(nextItems.reduce((sum, it) => sum + it.qty * it.price, 0).toFixed(2))
  orders.value[idx] = {
    ...orders.value[idx],
    ...values,
    items: nextItems,
    itemsCount: nextItems.length,
    totalAmount,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  return orders.value[idx]
}

const createOrder = (values: OrderFormValues) => {
  const seq = orders.value.length + 1
  const id = `ORD-2026-${String(seq).padStart(4, '0')}`
  const totalAmount = Number(
    values.items.reduce((sum, it) => sum + it.qty * it.price, 0).toFixed(2),
  )
  const today = new Date().toISOString().slice(0, 10)
  const order: Order = {
    id,
    ...values,
    itemsCount: values.items.length,
    totalAmount,
    createdAt: today,
    updatedAt: today,
  }
  orders.value.unshift(order)
  return order
}

const deleteOrder = (id: string) => {
  orders.value = orders.value.filter(o => o.id !== id)
}

export const useOrdersStore = () => ({
  orders,
  findOrder,
  updateOrder,
  createOrder,
  deleteOrder,
})
