import type { ColumnDef } from '@/components/ui/table'
import type { SubmissionVoucherCode } from '../../types'

export const submissionVoucherColumns: ColumnDef<SubmissionVoucherCode>[] = [
  { key: 'no', label: 'No', field: 'no', width: '60px' },
  { key: 'code', label: 'Kode Voucher', cell: 'code', minWidth: '160px' },
  { key: 'generatedAt', label: 'Tanggal Generate', cell: 'generatedAt', minWidth: '150px' },
  { key: 'status', label: 'Status Pakai', cell: 'status', minWidth: '150px' },
  { key: 'category', label: 'Kategori', field: 'category', minWidth: '110px' },
  { key: 'type', label: 'Tipe', field: 'type', minWidth: '80px' },
  {
    key: 'actions',
    label: 'Aksi',
    cell: 'actions',
    align: 'center',
    sortable: false,
    sticky: 'right',
  },
]
