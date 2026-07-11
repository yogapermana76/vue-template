import type { PillTabItem } from '@/components/ui/pill-tab'
import type { BadgeVariants } from '@/components/ui/badge'
import type { OrderPaymentMethod, OrderStatus, OrderStatusFilter } from './types'

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; variant: BadgeVariants['variant'] }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  paid: { label: 'Paid', variant: 'success' },
  shipped: { label: 'Shipped', variant: 'info' },
  cancelled: { label: 'Cancelled', variant: 'error' },
}

export const orderPaymentMethodLabel: Record<OrderPaymentMethod, string> = {
  card: 'Credit Card',
  transfer: 'Bank Transfer',
  ewallet: 'E-wallet',
}

export const orderStatusFilters: PillTabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'cancelled', label: 'Cancelled' },
]

export const orderStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const orderPaymentOptions = [
  { value: 'card', label: 'Credit Card' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'ewallet', label: 'E-wallet' },
]

export const isOrderStatusFilter = (v: string): v is OrderStatusFilter =>
  v === 'all' || v === 'pending' || v === 'paid' || v === 'shipped' || v === 'cancelled'
