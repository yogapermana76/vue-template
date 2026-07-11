import type { ColumnDef } from '@/components/ui/table'
import type { SubmissionRow } from '../../types'

const BASE_COLUMNS: ColumnDef<SubmissionRow>[] = [
  { key: 'id', label: 'ID Pengajuan', field: 'id', minWidth: '120px' },
  {
    key: 'submittedAt',
    label: 'Waktu Pengajuan',
    field: 'submittedAt',
    cell: 'submittedAt',
    minWidth: '160px',
  },
  { key: 'name', label: 'Nama', field: 'name', minWidth: '140px' },
  { key: 'phone', label: 'Nomor HP', field: 'phone', minWidth: '130px' },
  { key: 'email', label: 'Email', field: 'email', minWidth: '180px' },
  { key: 'company', label: 'Perusahaan/Komunitas', field: 'company', minWidth: '180px' },
  { key: 'category', label: 'Kategori', field: 'category', minWidth: '110px' },
  {
    key: 'totalVouchers',
    label: 'Total Jumlah',
    cell: 'totalVouchers',
    minWidth: '120px',
    align: 'left',
  },
]

const ACTION_COLUMN: ColumnDef<SubmissionRow> = {
  key: 'actions',
  label: 'Aksi',
  cell: 'actions',
  align: 'center',
  sortable: false,
  sticky: 'right',
}

// Action column only makes sense when >1 action is available per row. For
// view-only tabs, clicking the row already opens the detail — no extra column.
export const buildSubmissionColumns = (withActions: boolean): ColumnDef<SubmissionRow>[] =>
  withActions ? [...BASE_COLUMNS, ACTION_COLUMN] : BASE_COLUMNS
