import type { ColumnDef } from '@/components/ui/table'
import type { Invoice } from '../types'

export const createInvoiceColumns = (): ColumnDef<Invoice>[] => [
  {
    key: 'number',
    label: 'Invoice',
    sortable: true,
    cell: 'number',
    sticky: 'left',
    minWidth: '220px',
  },
  { key: 'clientName', label: 'Client', sortable: true, cell: 'client' },
  { key: 'issueDate', label: 'Issued', sortable: true, cell: 'issueDate' },
  { key: 'dueDate', label: 'Due', sortable: true, cell: 'dueDate' },
  { key: 'total', label: 'Total', sortable: true, align: 'right', cell: 'total' },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    align: 'center',
    cell: 'status',
    sticky: 'right',
  },
  {
    key: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    cell: 'actions',
    sticky: 'right',
  },
]
