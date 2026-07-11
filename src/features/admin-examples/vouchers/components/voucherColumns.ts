import type { ColumnDef } from '@/components/ui/table'
import type { Voucher } from '../types'

export const createVoucherColumns = (): ColumnDef<Voucher>[] => [
  {
    key: 'code',
    label: 'Code',
    sortable: true,
    cell: 'code',
    sticky: 'left',
    minWidth: '240px',
  },
  { key: 'kind', label: 'Type', sortable: true, cell: 'kind' },
  { key: 'amount', label: 'Value', sortable: true, align: 'right', cell: 'amount' },
  { key: 'usageCount', label: 'Usage', sortable: true, align: 'center', cell: 'usage' },
  { key: 'startsAt', label: 'Starts', sortable: true, cell: 'startsAt' },
  { key: 'endsAt', label: 'Ends', sortable: true, cell: 'endsAt' },
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
