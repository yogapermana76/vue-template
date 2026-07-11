import type { ColumnDef } from '@/components/ui/table'
import type { Product } from '../types'

export const createProductColumns = (): ColumnDef<Product>[] => [
  {
    key: 'name',
    label: 'Product',
    sortable: true,
    cell: 'name',
    sticky: 'left',
    minWidth: '260px',
  },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'brand', label: 'Brand', sortable: true },
  { key: 'price', label: 'Price', sortable: true, align: 'right', cell: 'price' },
  { key: 'margin', label: 'Margin', sortable: true, align: 'right', cell: 'margin' },
  { key: 'stock', label: 'Stock', sortable: true, align: 'center', cell: 'stock' },
  { key: 'supplier', label: 'Supplier', sortable: true },
  { key: 'warehouse', label: 'Warehouse', sortable: true },
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
