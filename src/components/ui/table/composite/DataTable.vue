<script setup lang="ts" generic="T extends Record<string, any>">
  import type { DataTableEmits, DataTableProps } from '../types'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { Checkbox } from '@/components/ui/checkbox'
  import { EmptyState } from '@/components/ui/empty-state'
  import { Skeleton } from '@/components/ui/skeleton'
  import { useDataTable } from '@/composables/ui/useDataTable'
  import { useStickyColumns } from '@/composables/ui/useStickyColumns'
  import { useTableColumns } from '@/composables/ui/useTableColumns'
  import Table from '../Table.vue'
  import TableBody from '../TableBody.vue'
  import TableCell from '../TableCell.vue'
  import TableHead from '../TableHead.vue'
  import TableHeader from '../TableHeader.vue'
  import TablePagination from '../TablePagination.vue'
  import TableRow from '../TableRow.vue'

  // Props with defaults
  const props = withDefaults(defineProps<DataTableProps<T>>(), {
    rowKey: 'id',
    selectable: false,
    pagination: false,
    sortable: true,
    loading: false,
    loadingRows: 5,
    emptyMessage: 'No data available',
    clickableRows: false,
    striped: false,
    dense: false,
    maxHeight: 'calc(100vh - 250px)',
    bordered: false,
  })

  const emit = defineEmits<DataTableEmits<T>>()

  // Refs
  const tableComponentRef = ref<{ wrapperRef: HTMLElement } | null>(null)
  const isScrolled = ref(false)

  // Computed
  const visibleColumns = computed(() => props.columns.filter(col => !col.hidden))
  const isPaginationEnabled = computed(() => props.pagination !== false)

  // Initialize table state
  const tableState = useDataTable({
    data: props.data,
    columns: props.columns,
    rowKey: props.rowKey,
    initialSort: props.sort,
    initialPagination:
      typeof props.pagination === 'object'
        ? props.pagination
        : { page: 1, pageSize: 10, total: props.data.length },
    initialSelectedRows: props.selectedRows,
    clientSideSorting: true,
    clientSidePagination: typeof props.pagination !== 'boolean' || props.pagination,
  })

  // Use composables
  const { getCellValue, renderCell, renderHeader, getColumnWidthStyle, getColumnWidthClass } =
    useTableColumns<T>()

  const { getStickyColumnClass, getStickyColumnStyle } = useStickyColumns<T>({
    tableRef: tableComponentRef,
    visibleColumns,
    selectable: props.selectable,
    striped: props.striped,
    isScrolledVertically: isScrolled,
  })

  // Column utilities
  const isColumnSortable = (column: DataTableProps<T>['columns'][number]) =>
    props.sortable && column.sortable !== false

  const getColumnSortState = (column: DataTableProps<T>['columns'][number]) =>
    tableState.sortBy.value === column.key ? tableState.sortDirection.value : false

  /** Checkbox column classes (sticky left, matches other sticky columns) */
  const getCheckboxHeaderClasses = () => [
    'w-12',
    'px-3!',
    'sticky',
    'left-0',
    ...(isScrolled.value
      ? ['z-50', 'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]', 'bg-white!']
      : ['z-30', 'bg-neutral-50!']),
  ]

  // Event handlers
  const handleSort = (columnKey: string) => {
    tableState.toggleSort(columnKey)
    emit('update:sort', tableState.sortOptions.value)
    emit('sortChange', tableState.sortBy.value ?? null, tableState.sortDirection.value)
  }

  const emitSelectedRows = () =>
    emit('update:selectedRows', Array.from(tableState.selectedRows.value ?? new Set()))

  const handleRowSelection = (rowKey: string | number) => {
    tableState.toggleRowSelection(rowKey)
    emitSelectedRows()
  }

  const handleSelectAll = () => {
    tableState.toggleAllRows()
    emitSelectedRows()
  }

  const handleRowClick = (row: T, rowIndex: number, event: MouseEvent) =>
    emit('rowClick', row, rowIndex, event)

  const handlePageChange = (page: number) => {
    tableState.goToPage(page)
    if (typeof props.pagination === 'object') {
      emit('update:pagination', { ...props.pagination, page })
    }
    emit('pageChange', page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    tableState.setPageSize(pageSize)
    if (typeof props.pagination === 'object') {
      emit('update:pagination', { ...props.pagination, pageSize, page: 1 })
    }
    emit('pageSizeChange', pageSize)
  }

  // Utilities
  const getCheckboxState = () => {
    const { isAllSelected, isIndeterminate } = tableState.selectionState.value
    return isAllSelected ? true : isIndeterminate ? 'indeterminate' : false
  }

  const getRowClasses = (rowIndex: number) =>
    props.striped && rowIndex % 2 === 1 ? 'bg-neutral-50' : ''

  const getCheckboxCellClasses = (rowIndex: number) => {
    const hasData = tableState.paginatedData.value.length > 0
    const isOdd = props.striped && rowIndex % 2 === 1
    return [
      'sticky',
      'left-0',
      'z-30',
      props.dense && 'py-2',
      // Base bg per stripe (sticky column needs opaque bg to hide horizontal-scrolled content underneath)
      hasData && (isOdd ? 'bg-neutral-50' : 'bg-white'),
      // Inherit row states (hover & selected) so the sticky checkbox column tints along
      '[tr:hover>&]:bg-neutral-50/60',
      '[tr[data-selected="true"]>&]:bg-primary-50',
    ]
  }

  const getDataCellClasses = (column: DataTableProps<T>['columns'][number], rowIndex: number) => [
    column.cellClass,
    props.dense && 'py-2',
    getStickyColumnClass(column, false, rowIndex),
  ]

  /**
   * Scroll tracking for sticky header styling
   * When scrolled vertically: headers get shadow, sticky columns get z-50
   */
  const updateHeaderScroll = () => {
    const wrapper = tableComponentRef.value?.wrapperRef
    if (wrapper) isScrolled.value = wrapper.scrollTop > 0
  }

  // Lifecycle: setup/cleanup scroll listener
  onMounted(() => {
    const wrapper = tableComponentRef.value?.wrapperRef
    if (wrapper && props.maxHeight) {
      wrapper.addEventListener('scroll', updateHeaderScroll)
      updateHeaderScroll()
    }
  })

  onUnmounted(() => {
    tableComponentRef.value?.wrapperRef?.removeEventListener('scroll', updateHeaderScroll)
  })
</script>

<template>
  <div
    data-slot="data-table"
    :class="[
      'w-full',
      bordered && 'bg-card shadow-card overflow-hidden rounded-md border border-neutral-200',
    ]"
  >
    <div
      v-if="$slots.toolbar"
      data-slot="data-table-toolbar"
      :class="
        bordered && 'from-primary-50 to-background border-b border-neutral-200 bg-linear-to-b'
      "
    >
      <slot name="toolbar" />
    </div>

    <Table ref="tableComponentRef" :class="props.class" :max-height="props.maxHeight">
      <!-- Table Header -->
      <TableHeader>
        <TableRow>
          <!-- Selection checkbox column -->
          <TableHead
            v-if="selectable"
            :class="getCheckboxHeaderClasses()"
            :style="maxHeight ? { top: '0' } : {}"
            :sticky-header="false"
            :is-scrolled="isScrolled"
            :is-sticky-column="true"
          >
            <Checkbox :checked="getCheckboxState()" @update:checked="handleSelectAll" />
          </TableHead>

          <!-- Data columns -->
          <TableHead
            v-for="column in visibleColumns"
            :key="column.key"
            :sortable="isColumnSortable(column)"
            :sorted="getColumnSortState(column)"
            :align="column.align"
            :sticky-header="!!maxHeight"
            :is-scrolled="isScrolled"
            :is-sticky-column="!!column.sticky"
            :class="[
              column.headerClass,
              getColumnWidthClass(column),
              getStickyColumnClass(column, true),
            ]"
            :style="{ ...getColumnWidthStyle(column), ...getStickyColumnStyle(column, true) }"
            @sort="handleSort(column.key)"
          >
            <!-- Custom header slot -->
            <slot
              v-if="typeof column.header === 'string'"
              :name="`header-${column.key}`"
              :column="column"
            >
              {{ renderHeader(column) }}
            </slot>
            <component
              v-else-if="typeof renderHeader(column) === 'object'"
              :is="renderHeader(column)"
            />
            <template v-else>
              {{ renderHeader(column) }}
            </template>
          </TableHead>
        </TableRow>
      </TableHeader>

      <!-- Table Body - Loading State -->
      <TableBody v-if="loading">
        <TableRow v-for="i in loadingRows" :key="`loading-${i}`">
          <TableCell v-if="selectable">
            <Skeleton class="h-4 w-4" />
          </TableCell>
          <TableCell v-for="column in visibleColumns" :key="column.key" :align="column.align">
            <Skeleton class="h-4 w-full" />
          </TableCell>
        </TableRow>
      </TableBody>

      <!-- Table Body - Empty State -->
      <TableBody v-else-if="tableState.paginatedData.value.length === 0">
        <TableRow>
          <TableCell :colspan="visibleColumns.length + (selectable ? 1 : 0)" class="py-12">
            <slot name="empty">
              <EmptyState title="No data found" :description="emptyMessage" class="min-h-50" />
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>

      <!-- Table Body - Data Rows -->
      <TableBody v-else>
        <TableRow
          v-for="(row, rowIndex) in tableState.paginatedData.value"
          :key="tableState.getRowKey(row, rowIndex)"
          :clickable="clickableRows"
          :selected="selectable && tableState.isRowSelected(tableState.getRowKey(row, rowIndex))"
          :class="getRowClasses(rowIndex)"
          @click="handleRowClick(row, rowIndex, $event)"
        >
          <!-- Selection checkbox — stopPropagation so row-click doesn't fire -->
          <TableCell
            v-if="selectable"
            :class="getCheckboxCellClasses(rowIndex)"
            @click.stop
            @pointerdown.stop
          >
            <Checkbox
              :checked="tableState.isRowSelected(tableState.getRowKey(row, rowIndex))"
              @update:checked="handleRowSelection(tableState.getRowKey(row, rowIndex))"
            />
          </TableCell>

          <!-- Data cells -->
          <TableCell
            v-for="column in visibleColumns"
            :key="column.key"
            :align="column.align"
            :class="[getDataCellClasses(column, rowIndex), getColumnWidthClass(column)]"
            :style="{ ...getColumnWidthStyle(column), ...getStickyColumnStyle(column) }"
          >
            <!-- Custom cell slot -->
            <slot
              v-if="typeof column.cell === 'string'"
              :name="`cell-${column.key}`"
              :row="row"
              :value="getCellValue(row, column)"
              :row-index="rowIndex"
              :column="column"
            >
              {{ getCellValue(row, column) }}
            </slot>
            <component
              v-else-if="typeof renderCell(column, row, rowIndex) === 'object'"
              :is="renderCell(column, row, rowIndex)"
            />
            <template v-else>
              {{ renderCell(column, row, rowIndex) }}
            </template>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div
      v-if="isPaginationEnabled && !loading"
      :class="
        bordered && 'from-primary-50 to-background border-t border-neutral-200 bg-linear-to-t'
      "
    >
      <TablePagination
        :pagination="tableState.paginationOptions.value"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>
