import type { Component, VNode } from 'vue'

export type SortDirection = 'asc' | 'desc' | false

export type CellAlignment = 'left' | 'center' | 'right'

export type CellValue = string | number | boolean | null | undefined

/**
 * Custom cell renderer function
 * @param value - The cell value
 * @param row - The complete row data
 * @param rowIndex - The row index
 * @returns VNode, Component, string, or number
 */
export type CellRenderer<T = Record<string, unknown>> = (
  value: unknown,
  row: T,
  rowIndex: number,
) => VNode | Component | string | number

/**
 * Column definition for DataTable
 */
export interface ColumnDef<T = Record<string, unknown>> {
  /**
   * Unique identifier for the column
   */
  key: string

  /**
   * Column header label
   */
  label?: string

  /**
   * Field name in the data object to extract value from
   * If not provided, uses the key
   */
  field?: keyof T | string

  /**
   * Enable sorting for this column
   */
  sortable?: boolean

  /**
   * Custom sort function
   */
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number

  /**
   * Cell alignment
   */
  align?: CellAlignment

  /**
   * Custom cell renderer
   * Can be a function or a slot name
   */
  cell?: CellRenderer<T> | string

  /**
   * Custom header renderer
   * Can be a function or a slot name
   */
  header?: CellRenderer<T> | string

  /**
   * Column width (CSS value: px, %, auto, etc.)
   */
  width?: string

  /**
   * Minimum column width
   */
  minWidth?: string

  /**
   * Maximum column width
   */
  maxWidth?: string

  /**
   * Width class for responsive design (e.g., 'w-full md:w-48')
   * Takes priority over width/minWidth/maxWidth if provided
   */
  widthClass?: string

  /**
   * Additional CSS classes for the column cells
   */
  cellClass?: string

  /**
   * Additional CSS classes for the header cell
   */
  headerClass?: string

  /**
   * Hide column on mobile
   */
  hideOnMobile?: boolean

  /**
   * Column is hidden
   */
  hidden?: boolean

  /**
   * Make column sticky (fixed position)
   * Use 'left' for sticky left columns, 'right' for sticky right columns
   * Commonly used for actions column or important data
   */
  sticky?: 'left' | 'right'

  /**
   * Z-index for sticky column (default: 10)
   * Higher values will be on top of other sticky columns
   */
  stickyZIndex?: number
}

/**
 * Pagination configuration
 */
export interface PaginationOptions {
  /**
   * Current page number (1-based)
   */
  page: number

  /**
   * Number of rows per page
   */
  pageSize: number

  /**
   * Total number of rows
   */
  total: number

  /**
   * Available page size options
   */
  pageSizeOptions?: number[]
}

/**
 * Sort configuration
 */
export interface SortOptions {
  /**
   * Column key to sort by
   */
  sortBy: string | null

  /**
   * Sort direction
   */
  sortDirection: SortDirection
}

/**
 * Selection state
 */
export interface SelectionState {
  /**
   * Selected row keys or indices
   */
  selectedRows: Set<string | number>

  /**
   * All rows are selected
   */
  isAllSelected: boolean

  /**
   * Some (but not all) rows are selected
   */
  isIndeterminate: boolean
}

/**
 * DataTable props interface
 */
export interface DataTableProps<T = Record<string, unknown>> {
  /**
   * Table data rows
   */
  data: T[]

  /**
   * Column definitions
   */
  columns: ColumnDef<T>[]

  /**
   * Unique row key field name
   * Used for row selection and tracking
   */
  rowKey?: keyof T | string

  /**
   * Enable row selection with checkboxes
   */
  selectable?: boolean

  /**
   * Currently selected row keys
   */
  selectedRows?: (string | number)[]

  /**
   * Enable pagination
   */
  pagination?: boolean | PaginationOptions

  /**
   * Enable sorting
   */
  sortable?: boolean

  /**
   * Current sort configuration
   */
  sort?: SortOptions

  /**
   * Loading state
   */
  loading?: boolean

  /**
   * Number of skeleton rows to show when loading
   */
  loadingRows?: number

  /**
   * Empty state message
   */
  emptyMessage?: string

  /**
   * Make rows clickable
   */
  clickableRows?: boolean

  /**
   * Striped rows style
   */
  striped?: boolean

  /**
   * Dense/compact mode
   */
  dense?: boolean

  /**
   * Maximum height of table body (enables vertical scrolling with sticky header)
   * Example: '400px', '50vh', 'calc(100vh - 200px)'
   */
  maxHeight?: string

  /**
   * Additional table classes
   */
  class?: string
}

/**
 * DataTable emits interface
 */
export interface DataTableEmits<T = Record<string, unknown>> {
  /**
   * Emitted when row selection changes
   */
  'update:selectedRows': [value: (string | number)[]]

  /**
   * Emitted when sort changes
   */
  'update:sort': [value: SortOptions]

  /**
   * Emitted when pagination changes
   */
  'update:pagination': [value: PaginationOptions]

  /**
   * Emitted when a row is clicked
   */
  rowClick: [row: T, rowIndex: number, event: MouseEvent]

  /**
   * Emitted when page changes
   */
  pageChange: [page: number]

  /**
   * Emitted when page size changes
   */
  pageSizeChange: [pageSize: number]

  /**
   * Emitted when sort changes (alternative event)
   */
  sortChange: [sortBy: string | null, direction: SortDirection]
}
