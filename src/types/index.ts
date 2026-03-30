/**
 * Common Types
 *
 * Types yang sering dipakai di seluruh aplikasi.
 */

// ============================================
// API Types
// ============================================

/** Standard paginated response */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

/** Pagination params untuk request */
export interface PaginationParams {
  page?: number
  limit?: number
}

/** Sort params untuk request */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ============================================
// UI Types
// ============================================

/** Option untuk select/dropdown */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

/** Menu item untuk navigation */
export interface MenuItem {
  label: string
  to?: string
  icon?: string
  children?: MenuItem[]
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string
  to?: string
}

// ============================================
// Utility Types
// ============================================

/** Nullable type */
export type Nullable<T> = T | null

/** Optional type */
export type Optional<T> = T | undefined

/** Maybe reactive ref */
export type MaybeRef<T> = T | import('vue').Ref<T>
