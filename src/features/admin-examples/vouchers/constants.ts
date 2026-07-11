import type { BadgeVariants } from '@/components/ui/badge'
import type { VoucherKind, VoucherStatus, VoucherStatusFilter } from './types'

export const voucherStatusMeta: Record<
  VoucherStatus,
  { label: string; variant: BadgeVariants['variant'] }
> = {
  active: { label: 'Active', variant: 'success' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  expired: { label: 'Expired', variant: 'neutral' },
  disabled: { label: 'Disabled', variant: 'error' },
}

export const voucherKindLabel: Record<VoucherKind, string> = {
  percentage: 'Percentage discount',
  fixed: 'Fixed amount',
  shipping: 'Free shipping',
}

export const voucherStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'expired', label: 'Expired' },
  { value: 'disabled', label: 'Disabled' },
]

export const voucherKindOptions = [
  { value: 'percentage', label: 'Percentage discount' },
  { value: 'fixed', label: 'Fixed amount' },
  { value: 'shipping', label: 'Free shipping' },
]

export const isVoucherStatusFilter = (v: string): v is VoucherStatusFilter =>
  v === 'all' || v === 'active' || v === 'scheduled' || v === 'expired' || v === 'disabled'
