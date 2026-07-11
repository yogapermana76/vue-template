import type { BadgeVariants } from '@/components/ui/badge'
import type { InvoiceStatus, InvoiceStatusFilter } from './types'

export const invoiceStatusMeta: Record<
  InvoiceStatus,
  { label: string; variant: BadgeVariants['variant'] }
> = {
  draft: { label: 'Draft', variant: 'neutral' },
  sent: { label: 'Sent', variant: 'info' },
  paid: { label: 'Paid', variant: 'success' },
  overdue: { label: 'Overdue', variant: 'error' },
  void: { label: 'Void', variant: 'warning' },
}

export const invoiceStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'void', label: 'Void' },
]

export const isInvoiceStatusFilter = (v: string): v is InvoiceStatusFilter =>
  v === 'all' || v === 'draft' || v === 'sent' || v === 'paid' || v === 'overdue' || v === 'void'
