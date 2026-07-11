import type { ColumnDef } from '@/components/ui/table'
import type { Category } from '../types'

export const createCategoryColumns = (): ColumnDef<Category>[] => [
  {
    key: 'name',
    label: 'Category',
    sortable: true,
    cell: 'name',
    sticky: 'left',
    minWidth: '260px',
  },
  { key: 'parent', label: 'Parent', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'productsCount', label: 'Products', sortable: true, align: 'center' },
  {
    key: 'isPublished',
    label: 'Published',
    sortable: true,
    align: 'center',
    cell: 'published',
  },
  { key: 'updatedAt', label: 'Updated', sortable: true, cell: 'updatedAt' },
  {
    key: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    cell: 'actions',
    sticky: 'right',
  },
]
