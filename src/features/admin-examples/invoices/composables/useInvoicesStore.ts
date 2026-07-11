import { ref } from 'vue'
import type { Invoice } from '../types'

const seed = (): Invoice[] => [
  {
    id: 'INV-2026-0001',
    number: 'INV-2026-0001',
    clientName: 'Ayu Pertiwi',
    clientEmail: 'ayu@ayucraft.co',
    clientAddress: 'Jl. Merdeka No. 12, Bandung',
    issueDate: '2026-06-24',
    dueDate: '2026-07-24',
    status: 'sent',
    subtotal: 1250,
    taxRate: 11,
    tax: 137.5,
    total: 1387.5,
    currency: 'USD',
    items: [
      { id: 1, description: 'Brand strategy workshop', quantity: 1, unitPrice: 750 },
      { id: 2, description: 'Logo redesign', quantity: 1, unitPrice: 500 },
    ],
    timeline: [
      {
        id: 1,
        kind: 'created',
        label: 'Invoice created',
        timestamp: '2026-06-24T09:12:00Z',
        actor: 'John Doe',
      },
      {
        id: 2,
        kind: 'sent',
        label: 'Sent to client',
        timestamp: '2026-06-24T09:15:00Z',
        actor: 'John Doe',
      },
      {
        id: 3,
        kind: 'reminder',
        label: 'Reminder email queued for due date',
        timestamp: '2026-07-22T00:00:00Z',
      },
    ],
    notes: 'Bank transfer preferred. Reference INV-2026-0001 in the description.',
  },
  {
    id: 'INV-2026-0002',
    number: 'INV-2026-0002',
    clientName: 'Budi Santoso',
    clientEmail: 'budi@nusa.industries',
    clientAddress: 'Jl. Sudirman No. 45, Jakarta',
    issueDate: '2026-06-30',
    dueDate: '2026-07-15',
    status: 'paid',
    subtotal: 3200,
    taxRate: 11,
    tax: 352,
    total: 3552,
    currency: 'USD',
    items: [
      { id: 1, description: 'Monthly retainer — June', quantity: 1, unitPrice: 2500 },
      { id: 2, description: 'Content audit', quantity: 1, unitPrice: 700 },
    ],
    timeline: [
      {
        id: 1,
        kind: 'created',
        label: 'Invoice created',
        timestamp: '2026-06-30T11:04:00Z',
        actor: 'John Doe',
      },
      {
        id: 2,
        kind: 'sent',
        label: 'Sent to client',
        timestamp: '2026-06-30T11:10:00Z',
      },
      {
        id: 3,
        kind: 'paid',
        label: 'Payment received',
        timestamp: '2026-07-04T14:22:00Z',
        note: 'Wire transfer confirmed',
      },
    ],
  },
  {
    id: 'INV-2026-0003',
    number: 'INV-2026-0003',
    clientName: 'Citra Wijaya',
    clientEmail: 'citra@thebloom.co',
    clientAddress: 'Jl. Gatot Subroto No. 8, Surabaya',
    issueDate: '2026-05-20',
    dueDate: '2026-06-20',
    status: 'overdue',
    subtotal: 900,
    taxRate: 11,
    tax: 99,
    total: 999,
    currency: 'USD',
    items: [{ id: 1, description: 'Photography session', quantity: 1, unitPrice: 900 }],
    timeline: [
      {
        id: 1,
        kind: 'created',
        label: 'Invoice created',
        timestamp: '2026-05-20T09:00:00Z',
        actor: 'John Doe',
      },
      { id: 2, kind: 'sent', label: 'Sent to client', timestamp: '2026-05-20T09:05:00Z' },
      {
        id: 3,
        kind: 'reminder',
        label: '1st reminder sent',
        timestamp: '2026-06-25T09:00:00Z',
      },
      {
        id: 4,
        kind: 'reminder',
        label: '2nd reminder sent',
        timestamp: '2026-07-02T09:00:00Z',
      },
    ],
    notes: 'Client contacted on 2026-07-05 — payment expected within a week.',
  },
  {
    id: 'INV-2026-0004',
    number: 'INV-2026-0004',
    clientName: 'Dimas Prasetya',
    clientEmail: 'dimas@makers.hq',
    clientAddress: 'Jl. Diponegoro No. 33, Semarang',
    issueDate: '2026-07-05',
    dueDate: '2026-08-05',
    status: 'draft',
    subtotal: 480,
    taxRate: 11,
    tax: 52.8,
    total: 532.8,
    currency: 'USD',
    items: [{ id: 1, description: 'Consultation call', quantity: 2, unitPrice: 240 }],
    timeline: [
      {
        id: 1,
        kind: 'created',
        label: 'Draft saved',
        timestamp: '2026-07-05T15:38:00Z',
        actor: 'John Doe',
      },
    ],
  },
]

const invoices = ref<Invoice[]>(seed())

const findInvoice = (id: string) => invoices.value.find(i => i.id === id) ?? null

const updateInvoice = (id: string, values: Partial<Invoice>) => {
  const idx = invoices.value.findIndex(i => i.id === id)
  if (idx === -1) return null
  invoices.value[idx] = { ...invoices.value[idx], ...values }
  return invoices.value[idx]
}

const deleteInvoice = (id: string) => {
  invoices.value = invoices.value.filter(i => i.id !== id)
}

export const useInvoicesStore = () => ({ invoices, findInvoice, updateInvoice, deleteInvoice })
