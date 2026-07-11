export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'
export type OrderPaymentMethod = 'card' | 'transfer' | 'ewallet'

export interface OrderItem {
  id: number
  productName: string
  sku: string
  qty: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  paymentMethod: OrderPaymentMethod
  totalAmount: number
  itemsCount: number
  items: OrderItem[]
  shippingAddress: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type OrderFormValues = Pick<
  Order,
  'customerName' | 'customerEmail' | 'status' | 'paymentMethod' | 'shippingAddress' | 'notes'
> & { items: OrderItem[] }

export type OrderStatusFilter = 'all' | OrderStatus
