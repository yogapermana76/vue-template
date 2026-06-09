import type { ColumnDef } from '@/components/ui/table/types'
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface UseStickyColumnsOptions<T> {
  /** Reference to the table wrapper element */
  tableRef: Ref<{ wrapperRef: HTMLElement } | null>
  /** Visible columns that may have sticky positioning */
  visibleColumns: Ref<ColumnDef<T>[]>
  /** Whether table has selectable rows (affects left offset calculation) */
  selectable: boolean
  /** Whether table has striped rows (affects background color) */
  striped: boolean
  /** Reactive state for vertical scroll (affects shadows and z-index) */
  isScrolledVertically?: Ref<boolean>
}

// ============================================================================
// Constants
// ============================================================================

const Z_INDEX = {
  BODY_NON_INNERMOST: 'z-20',
  BODY_INNERMOST: 'z-[25]',
  HEADER_NON_INNERMOST: 'z-[28]',
  HEADER_INNERMOST: 'z-30',
  STICKY_HEADER_SCROLLED: 'z-50', // Must be above regular headers (z-40)
} as const

const SHADOW = {
  VERTICAL: 'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]',
  HORIZONTAL_LEFT: 'shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]',
  HORIZONTAL_RIGHT: 'shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]',
  COMBINED_LEFT: 'shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.12)]',
  COMBINED_RIGHT: 'shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.12)]',
} as const

// ============================================================================
// Composable
// ============================================================================

/**
 * Manages sticky column positioning and styling in data tables
 *
 * @example
 * ```ts
 * const { getStickyColumnClass, getStickyColumnStyle } = useStickyColumns({
 *   tableRef, visibleColumns, selectable: true, striped: true, isScrolledVertically: isScrolled
 * })
 * ```
 */
export function useStickyColumns<T extends Record<string, unknown>>(
  options: UseStickyColumnsOptions<T>,
) {
  const { tableRef, visibleColumns, selectable, striped, isScrolledVertically } = options

  // ============================================================================
  // State
  // ============================================================================

  const stickyOffsets = ref<Map<string, number>>(new Map())
  const showLeftShadow = ref(false)
  const showRightShadow = ref(false)

  // ============================================================================
  // Computed
  // ============================================================================

  const stickyLeftColumns = computed(() =>
    visibleColumns.value.filter(col => col.sticky === 'left'),
  )
  const stickyRightColumns = computed(() =>
    visibleColumns.value.filter(col => col.sticky === 'right'),
  )

  // ============================================================================
  // Helpers
  // ============================================================================

  /** Get table DOM elements */
  const getTableElements = () => {
    const wrapper = tableRef.value?.wrapperRef
    if (!wrapper) return null

    const table = wrapper.querySelector('table')
    const headerRow = table?.querySelector('thead tr')
    const cells = headerRow ? (Array.from(headerRow.querySelectorAll('th')) as HTMLElement[]) : []

    return table && headerRow ? { wrapper, table, headerRow, cells } : null
  }

  /** Map columns to their DOM indices */
  const getColumnsWithDomIndex = (sticky: 'left' | 'right') =>
    visibleColumns.value
      .map((col, index) => ({ col, domIndex: selectable ? index + 1 : index }))
      .filter(({ col }) => col.sticky === sticky)

  /** Check if column is the innermost sticky column (closest to scrolling content) */
  const isInnermostColumn = (column: ColumnDef<T>) => {
    if (!column.sticky) return false
    const columns = column.sticky === 'left' ? stickyLeftColumns.value : stickyRightColumns.value
    const target = column.sticky === 'left' ? columns[columns.length - 1] : columns[0]
    return column.key === target?.key
  }

  /** Check if sticky column is currently floating (separated from edge) */
  const isFloating = (column: ColumnDef<T>) => {
    if (!column.sticky) return false
    return column.sticky === 'left' ? showLeftShadow.value : showRightShadow.value
  }

  // ============================================================================
  // Offset Calculation
  // ============================================================================

  /** Calculate sticky offsets from left edge */
  const calculateLeftOffsets = (cells: HTMLElement[], offsets: Map<string, number>) => {
    const columns = getColumnsWithDomIndex('left')
    let offset = selectable && cells[0] ? cells[0].getBoundingClientRect().width : 0

    columns.forEach(({ col }, index) => {
      if (index === 0) {
        offsets.set(col.key, offset)
      } else {
        const prevCell = cells[columns[index - 1].domIndex]
        if (prevCell) {
          offset += prevCell.getBoundingClientRect().width
          offsets.set(col.key, offset)
        }
      }
    })
  }

  /** Calculate sticky offsets from right edge */
  const calculateRightOffsets = (cells: HTMLElement[], offsets: Map<string, number>) => {
    const columns = getColumnsWithDomIndex('right')
    let offset = 0

    for (let i = columns.length - 1; i >= 0; i--) {
      offsets.set(columns[i].col.key, offset)
      if (i > 0) {
        const cell = cells[columns[i].domIndex]
        if (cell) offset += cell.getBoundingClientRect().width
      }
    }
  }

  /** Calculate all sticky column offsets */
  const calculateStickyOffsets = () => {
    const elements = getTableElements()
    if (!elements) return

    const offsets = new Map<string, number>()
    calculateLeftOffsets(elements.cells, offsets)
    calculateRightOffsets(elements.cells, offsets)
    stickyOffsets.value = offsets
  }

  /** Update shadow visibility based on scroll position */
  const updateScrollShadows = () => {
    const wrapper = tableRef.value?.wrapperRef
    if (!wrapper) return

    const { scrollLeft, scrollWidth, clientWidth } = wrapper
    showLeftShadow.value = scrollLeft > 0
    showRightShadow.value = scrollLeft < scrollWidth - clientWidth - 1
  }

  // ============================================================================
  // Styling Functions
  // ============================================================================

  /** Get z-index class for column */
  const getZIndexClass = (column: ColumnDef<T>, isHeader: boolean) => {
    const isInnermost = isInnermostColumn(column)
    const isVScrolled = isScrolledVertically?.value ?? false

    if (isHeader) {
      return isVScrolled
        ? Z_INDEX.STICKY_HEADER_SCROLLED
        : isInnermost
          ? Z_INDEX.HEADER_INNERMOST
          : Z_INDEX.HEADER_NON_INNERMOST
    }
    return isInnermost ? Z_INDEX.BODY_INNERMOST : Z_INDEX.BODY_NON_INNERMOST
  }

  /** Get shadow class for column */
  const getShadowClass = (column: ColumnDef<T>, isHeader: boolean) => {
    if (!isHeader) {
      // Body cells: only horizontal shadow when floating
      return isFloating(column) && isInnermostColumn(column)
        ? column.sticky === 'left'
          ? SHADOW.HORIZONTAL_LEFT
          : SHADOW.HORIZONTAL_RIGHT
        : ''
    }

    // Header cells: vertical and/or horizontal shadows
    const hasVertical = isScrolledVertically?.value ?? false
    const hasHorizontal = isFloating(column) && isInnermostColumn(column)

    if (hasVertical && hasHorizontal) {
      return column.sticky === 'left' ? SHADOW.COMBINED_LEFT : SHADOW.COMBINED_RIGHT
    }
    if (hasVertical) return SHADOW.VERTICAL
    if (hasHorizontal) {
      return column.sticky === 'left' ? SHADOW.HORIZONTAL_LEFT : SHADOW.HORIZONTAL_RIGHT
    }
    return ''
  }

  /** Get background class for column */
  const getBackgroundClass = (column: ColumnDef<T>, isHeader: boolean, rowIndex?: number) => {
    const isVScrolled = isScrolledVertically?.value ?? false
    const isColumnFloating = isFloating(column)

    if (isHeader) {
      return isVScrolled ? 'bg-white!' : isColumnFloating ? '!bg-neutral-50' : ''
    }

    // Body cells
    if (isColumnFloating) {
      const isOddRow = striped && rowIndex !== undefined && rowIndex % 2 === 1
      return isOddRow ? '!bg-neutral-50' : '!bg-white'
    }
    return '!bg-transparent'
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Get inline styles for sticky column positioning
   * @param column - Column definition
   * @param isHeader - Whether this is a header cell (needs top: 0 for dual-axis sticky)
   */
  const getStickyColumnStyle = (column: ColumnDef<T>, isHeader = false) => {
    if (!column.sticky) return {}

    const offset = stickyOffsets.value.get(column.key) ?? 0
    const side = column.sticky === 'left' ? 'left' : 'right'

    // Headers need top: 0 for dual-axis stickiness
    return isHeader ? { [side]: `${offset}px`, top: '0' } : { [side]: `${offset}px` }
  }

  /**
   * Get complete class string for sticky column
   * @param column - Column definition
   * @param isHeader - Whether this is a header cell
   * @param rowIndex - Row index for striped background
   */
  const getStickyColumnClass = (column: ColumnDef<T>, isHeader = false, rowIndex?: number) => {
    if (!column.sticky) return ''

    return [
      'sticky',
      getZIndexClass(column, isHeader),
      getShadowClass(column, isHeader),
      getBackgroundClass(column, isHeader, rowIndex),
    ]
      .filter(Boolean)
      .join(' ')
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    const wrapper = tableRef.value?.wrapperRef
    if (!wrapper) return

    // Initial calculation
    setTimeout(() => {
      calculateStickyOffsets()
      updateScrollShadows()
    }, 0)

    // Setup listeners
    wrapper.addEventListener('scroll', updateScrollShadows)
    resizeObserver = new ResizeObserver(calculateStickyOffsets)
    resizeObserver.observe(wrapper)
  })

  onUnmounted(() => {
    const wrapper = tableRef.value?.wrapperRef
    wrapper?.removeEventListener('scroll', updateScrollShadows)
    resizeObserver?.disconnect()
  })

  return {
    getStickyColumnClass,
    getStickyColumnStyle,
    stickyLeftColumns,
    stickyRightColumns,
  }
}
