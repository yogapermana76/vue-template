import type {
  ColumnDef,
  PaginationOptions,
  SelectionState,
  SortDirection,
  SortOptions,
} from '@/components/ui/table/types'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, ref, toValue, watch } from 'vue'

export interface UseDataTableOptions<T = Record<string, unknown>> {
  /** Table data. Reactive-accepting so query results propagate through. */
  data: MaybeRefOrGetter<T[]>

  /** Column definitions. Reactive-accepting like `data`. */
  columns: MaybeRefOrGetter<ColumnDef<T>[]>

  /**
   * Row key field for selection tracking
   */
  rowKey?: keyof T | string

  /**
   * Initial sort configuration
   */
  initialSort?: SortOptions

  /**
   * Initial pagination configuration
   */
  initialPagination?: Partial<PaginationOptions>

  /**
   * Initial selected rows
   */
  initialSelectedRows?: (string | number)[]

  /**
   * Enable client-side sorting
   */
  clientSideSorting?: boolean

  /**
   * Enable client-side pagination
   */
  clientSidePagination?: boolean
}

export interface UseDataTableReturn<T = Record<string, unknown>> {
  // Data
  processedData: ComputedRef<T[]>
  paginatedData: ComputedRef<T[]>

  // Sorting
  sortBy: Ref<string | null>
  sortDirection: Ref<SortDirection>
  sortOptions: ComputedRef<SortOptions>
  toggleSort: (columnKey: string) => void
  clearSort: () => void

  // Pagination
  currentPage: Ref<number>
  pageSize: Ref<number>
  totalPages: ComputedRef<number>
  totalRows: ComputedRef<number>
  paginationOptions: ComputedRef<PaginationOptions>
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setPageSize: (size: number) => void
  canGoPrev: ComputedRef<boolean>
  canGoNext: ComputedRef<boolean>

  // Selection
  selectedRows: Ref<Set<string | number>>
  selectionState: ComputedRef<SelectionState>
  toggleRowSelection: (rowKey: string | number) => void
  toggleAllRows: () => void
  clearSelection: () => void
  isRowSelected: (rowKey: string | number) => boolean
  selectRows: (rowKeys: (string | number)[]) => void

  // Utilities
  getRowKey: (row: T, index: number) => string | number
}

export function useDataTable<T = Record<string, unknown>>(
  options: UseDataTableOptions<T>,
): UseDataTableReturn<T> {
  const {
    data,
    columns,
    rowKey = 'id',
    initialSort,
    initialPagination,
    initialSelectedRows = [],
    clientSideSorting = true,
    clientSidePagination = true,
  } = options

  // Wrap in `computed(() => toValue(...))` so refs/getters re-evaluate;
  // a bare destructure captured the array at setup time and never updated.
  const dataRef = computed(() => toValue(data))
  const columnsRef = computed(() => toValue(columns))

  // Sorting state
  const sortBy = ref<string | null>(initialSort?.sortBy ?? null)
  const sortDirection = ref<SortDirection>(initialSort?.sortDirection ?? false)

  const sortOptions = computed<SortOptions>(() => ({
    sortBy: sortBy.value,
    sortDirection: sortDirection.value,
  }))

  // Pagination state
  const currentPage = ref(initialPagination?.page ?? 1)
  const pageSize = ref(initialPagination?.pageSize ?? 10)

  // Selection state
  const selectedRows = ref<Set<string | number>>(new Set(initialSelectedRows))

  // Get row key helper
  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === 'string') {
      return ((row as Record<string, unknown>)[rowKey] as string | number) ?? index
    }
    return index
  }

  // Sorting logic
  const toggleSort = (columnKey: string) => {
    if (sortBy.value === columnKey) {
      // Cycle through: asc -> desc -> none
      if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc'
      } else if (sortDirection.value === 'desc') {
        sortDirection.value = false
        sortBy.value = null
      }
    } else {
      sortBy.value = columnKey
      sortDirection.value = 'asc'
    }

    // Reset to first page when sort changes
    currentPage.value = 1
  }

  const clearSort = () => {
    sortBy.value = null
    sortDirection.value = false
  }

  // Processed data (sorted)
  const processedData = computed(() => {
    const result = [...dataRef.value]

    // Client-side sorting
    if (clientSideSorting && sortBy.value && sortDirection.value) {
      const column = columnsRef.value.find(col => col.key === sortBy.value)
      if (column) {
        result.sort((a, b) => {
          // Use custom sort function if provided
          if (column.sortFn) {
            return column.sortFn(a, b, sortDirection.value as 'asc' | 'desc')
          }

          // Default sort by field value
          const field = (column.field ?? column.key) as keyof T
          const aVal = a[field]
          const bVal = b[field]

          // Handle null/undefined values
          if (aVal == null && bVal == null) return 0
          if (aVal == null) return sortDirection.value === 'asc' ? 1 : -1
          if (bVal == null) return sortDirection.value === 'asc' ? -1 : 1

          // Compare values
          let comparison = 0
          if (aVal < bVal) comparison = -1
          if (aVal > bVal) comparison = 1

          return sortDirection.value === 'asc' ? comparison : -comparison
        })
      }
    }

    return result
  })

  // Total rows
  const totalRows = computed(() => processedData.value.length)

  // Total pages
  const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value))

  // Paginated data
  const paginatedData = computed(() => {
    if (!clientSidePagination) {
      return processedData.value
    }

    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return processedData.value.slice(start, end)
  })

  // Pagination options
  const paginationOptions = computed<PaginationOptions>(() => ({
    page: currentPage.value,
    pageSize: pageSize.value,
    total: totalRows.value,
    pageSizeOptions: initialPagination?.pageSizeOptions ?? [5, 10, 20, 50, 100],
  }))

  // Pagination methods
  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages.value))
    currentPage.value = newPage
  }

  const nextPage = () => {
    if (canGoNext.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (canGoPrev.value) {
      currentPage.value--
    }
  }

  const setPageSize = (size: number) => {
    pageSize.value = size
    // Reset to first page when page size changes
    currentPage.value = 1
  }

  const canGoPrev = computed(() => currentPage.value > 1)
  const canGoNext = computed(() => currentPage.value < totalPages.value)

  // Selection state
  const selectionState = computed<SelectionState>(() => {
    const totalSelectableRows = paginatedData.value.length
    const selectedCount = paginatedData.value.filter((row, index) => {
      const key = getRowKey(row, index)
      return selectedRows.value.has(key)
    }).length

    return {
      selectedRows: selectedRows.value,
      isAllSelected: totalSelectableRows > 0 && selectedCount === totalSelectableRows,
      isIndeterminate: selectedCount > 0 && selectedCount < totalSelectableRows,
    }
  })

  // Selection methods
  const toggleRowSelection = (rowKey: string | number) => {
    if (selectedRows.value.has(rowKey)) {
      selectedRows.value.delete(rowKey)
    } else {
      selectedRows.value.add(rowKey)
    }
    // Trigger reactivity
    selectedRows.value = new Set(selectedRows.value)
  }

  const toggleAllRows = () => {
    if (selectionState.value.isAllSelected) {
      // Deselect all visible rows
      paginatedData.value.forEach((row, index) => {
        const key = getRowKey(row, index)
        selectedRows.value.delete(key)
      })
    } else {
      // Select all visible rows
      paginatedData.value.forEach((row, index) => {
        const key = getRowKey(row, index)
        selectedRows.value.add(key)
      })
    }
    // Trigger reactivity
    selectedRows.value = new Set(selectedRows.value)
  }

  const clearSelection = () => {
    selectedRows.value.clear()
    selectedRows.value = new Set()
  }

  const isRowSelected = (rowKey: string | number): boolean => {
    return selectedRows.value.has(rowKey)
  }

  const selectRows = (rowKeys: (string | number)[]) => {
    selectedRows.value = new Set(rowKeys)
  }

  // Watch for data changes and adjust current page if needed
  watch(
    () => totalPages.value,
    newTotalPages => {
      if (currentPage.value > newTotalPages && newTotalPages > 0) {
        currentPage.value = newTotalPages
      }
    },
  )

  return {
    // Data
    processedData,
    paginatedData,

    // Sorting
    sortBy,
    sortDirection,
    sortOptions,
    toggleSort,
    clearSort,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    totalRows,
    paginationOptions,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    canGoPrev,
    canGoNext,

    // Selection
    selectedRows,
    selectionState,
    toggleRowSelection,
    toggleAllRows,
    clearSelection,
    isRowSelected,
    selectRows,

    // Utilities
    getRowKey,
  }
}
