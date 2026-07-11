import type { ColumnDef } from '@/components/ui/table'
import type { User } from '../types'

export const createUserColumns = (): ColumnDef<User>[] => [
  {
    key: 'name',
    label: 'User',
    sortable: true,
    cell: 'name',
    sticky: 'left',
    minWidth: '260px',
  },
  { key: 'role', label: 'Role', sortable: true, cell: 'role' },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'joinedAt', label: 'Joined', sortable: true, cell: 'joinedAt' },
  { key: 'lastLoginAt', label: 'Last login', sortable: true, cell: 'lastLoginAt' },
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

export const userInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('')
