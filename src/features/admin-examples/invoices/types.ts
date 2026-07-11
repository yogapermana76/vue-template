export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void'

export interface InvoiceLineItem {
  id: number
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceTimelineEvent {
  id: number
  label: string
  timestamp: string
  actor?: string
  note?: string
  kind: 'created' | 'sent' | 'paid' | 'reminder' | 'note'
}

export interface Invoice {
  id: string
  number: string
  clientName: string
  clientEmail: string
  clientAddress: string
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  subtotal: number
  taxRate: number
  tax: number
  total: number
  currency: string
  items: InvoiceLineItem[]
  timeline: InvoiceTimelineEvent[]
  notes?: string
}

export type InvoiceStatusFilter = 'all' | InvoiceStatus
