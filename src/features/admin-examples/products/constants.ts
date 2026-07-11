import type { PillTabItem } from '@/components/ui/pill-tab'
import type { BadgeVariants } from '@/components/ui/badge'
import type { ProductStatus, ProductStatusFilter } from './types'

export const productStatusMeta: Record<
  ProductStatus,
  { label: string; variant: BadgeVariants['variant'] }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'neutral' },
  out_of_stock: { label: 'Out of Stock', variant: 'error' },
}

export const productStatusFilters: PillTabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'out_of_stock', label: 'Out of Stock' },
]

export const productCategoryOptions = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Appliances', label: 'Appliances' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Accessories', label: 'Accessories' },
]

export const productStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

export const isProductStatusFilter = (v: string): v is ProductStatusFilter =>
  v === 'all' || v === 'active' || v === 'inactive' || v === 'out_of_stock'
