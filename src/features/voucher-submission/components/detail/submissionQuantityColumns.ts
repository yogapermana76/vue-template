import type { ColumnDef } from '@/components/ui/table'
import type { SubmissionQuantityDetail } from '../../types'

export const buildSubmissionQuantityColumns = (
  mode: 'view' | 'edit',
): ColumnDef<SubmissionQuantityDetail>[] => [
  { key: 'category', label: 'Kategori', field: 'category', minWidth: '110px' },
  { key: 'type', label: 'Tipe', field: 'type', minWidth: '80px' },
  {
    key: 'requested',
    label: 'Jumlah Pengajuan',
    field: 'requested',
    minWidth: '140px',
    align: 'left',
  },
  {
    key: 'approved',
    label: mode === 'edit' ? 'Jumlah Disetujui' : 'Disetujui',
    cell: 'approved',
    minWidth: '140px',
    align: 'left',
    sortable: false,
  },
]
