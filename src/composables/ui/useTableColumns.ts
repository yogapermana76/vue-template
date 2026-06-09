import type { ColumnDef } from '@/components/ui/table/types'

// Default minimum width for table columns
const DEFAULT_MIN_WIDTH = '120px'
const DEFAULT_MIN_WIDTH_CLASS = 'min-w-30' // 120px in Tailwind

export function useTableColumns<T extends Record<string, any>>() {
  // Get cell value from row data
  const getCellValue = (row: T, column: ColumnDef<T>) => {
    const field = (column.field ?? column.key) as keyof T
    return row[field]
  }

  // Render cell content
  const renderCell = (column: ColumnDef<T>, row: T, rowIndex: number) => {
    const value = getCellValue(row, column)

    if (!column.cell) {
      return value != null ? String(value) : ''
    }

    if (typeof column.cell === 'function') {
      const result = column.cell(value, row, rowIndex)
      return typeof result === 'object' ? result : String(result ?? '')
    }

    // If cell is a string, it's a slot name - handled in template
    return value
  }

  // Render header content
  const renderHeader = (column: ColumnDef<T>) => {
    if (!column.header || typeof column.header !== 'function') {
      return column.label ?? column.key
    }

    const result = column.header(null, {} as T, 0)
    return typeof result === 'object' ? result : String(result ?? '')
  }

  /**
   * Check if column has custom width configuration
   */
  const hasCustomWidth = (column: ColumnDef<T>) =>
    !!(column.width || column.minWidth || column.maxWidth || column.widthClass)

  /**
   * Get column width inline styles
   * Priority: widthClass > custom width props > default
   */
  const getColumnWidthStyle = (column: ColumnDef<T>) => {
    // If widthClass is provided, don't use inline styles
    if (column.widthClass) return {}

    const style: Record<string, string> = {}

    // Apply custom widths if provided
    if (column.width) style.width = column.width
    if (column.minWidth) style.minWidth = column.minWidth
    if (column.maxWidth) style.maxWidth = column.maxWidth

    // Apply default minWidth if not specified
    if (!hasCustomWidth(column)) {
      style.minWidth = DEFAULT_MIN_WIDTH
    }

    return style
  }

  /**
   * Get column width CSS classes
   * Used for responsive design via Tailwind classes
   */
  const getColumnWidthClass = (column: ColumnDef<T>) => {
    // If custom widthClass provided, use it
    if (column.widthClass) return column.widthClass

    // If width/minWidth/maxWidth provided, no default class needed (handled by inline styles)
    if (column.width || column.minWidth || column.maxWidth) return ''

    // Default: min-width via Tailwind class
    return DEFAULT_MIN_WIDTH_CLASS
  }

  return {
    getCellValue,
    renderCell,
    renderHeader,
    getColumnWidthStyle,
    getColumnWidthClass,
  }
}
