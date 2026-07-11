import type { ColumnDef } from '@/components/ui/table'
import type { Order } from '../types'

export const createOrderColumns = (): ColumnDef<Order>[] => [
  {
    key: 'id',
    label: 'Order ID',
    sortable: true,
    cell: 'id',
    sticky: 'left',
    minWidth: '180px',
  },
  { key: 'customerName', label: 'Customer', sortable: true, cell: 'customer' },
  { key: 'itemsCount', label: 'Items', sortable: true, align: 'center' },
  { key: 'paymentMethod', label: 'Payment', sortable: true, cell: 'payment' },
  { key: 'totalAmount', label: 'Total', sortable: true, align: 'right', cell: 'total' },
  { key: 'createdAt', label: 'Created', sortable: true, cell: 'createdAt' },
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
