<script setup lang="ts">
  import type { PaginationOptions } from './types'
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { useMediaQuery } from '@vueuse/core'
  import { Button } from '@/components/ui/button'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'

  interface Props {
    pagination: PaginationOptions
    showPageSizeSelector?: boolean
    showPageInfo?: boolean
    showFirstLast?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    showPageSizeSelector: true,
    showPageInfo: true,
    showFirstLast: true,
  })

  const emit = defineEmits<{
    pageChange: [page: number]
    pageSizeChange: [pageSize: number]
  }>()

  // ============================================================================
  // Computed
  // ============================================================================

  const isMobile = useMediaQuery('(max-width: 639px)')
  const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.pageSize))
  const canGoPrev = computed(() => props.pagination.page > 1)
  const canGoNext = computed(() => props.pagination.page < totalPages.value)
  const pageSizeOptions = computed(() => props.pagination.pageSizeOptions ?? [5, 10, 20, 50, 100])

  // ============================================================================
  // Helpers
  // ============================================================================

  const generateRange = (start: number, end: number) => {
    const pages: number[] = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const getMobilePageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
    if (total <= 3) return generateRange(1, total)
    if (current === 1) return [1, 2, 'ellipsis', total]
    if (current === total) return [1, 'ellipsis', total - 1, total]
    return [1, 'ellipsis', current, 'ellipsis', total]
  }

  const getDesktopPageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
    if (total <= 7) return generateRange(1, total)

    if (current <= 3) return [1, 2, 3, 4, 'ellipsis', total]
    if (current >= total - 2) return [1, 'ellipsis', total - 3, total - 2, total - 1, total]
    return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
  }

  // ============================================================================
  // Page Numbers
  // ============================================================================

  const pageNumbers = computed(() => {
    const current = props.pagination.page
    const total = totalPages.value
    return isMobile.value
      ? getMobilePageNumbers(current, total)
      : getDesktopPageNumbers(current, total)
  })

  // ============================================================================
  // Actions
  // ============================================================================

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      emit('pageChange', page)
    }
  }

  const goToFirstPage = () => canGoPrev.value && goToPage(1)
  const goToPrevPage = () => canGoPrev.value && goToPage(props.pagination.page - 1)
  const goToNextPage = () => canGoNext.value && goToPage(props.pagination.page + 1)
  const goToLastPage = () => canGoNext.value && goToPage(totalPages.value)
  const handlePageSizeChange = (size: number) => emit('pageSizeChange', size)
</script>

<template>
  <div
    data-slot="table-pagination"
    class="flex flex-col gap-3 border-t border-neutral-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
  >
    <!-- Page size selector (Left side) -->
    <div
      v-if="showPageSizeSelector"
      class="flex items-center justify-center gap-2 sm:justify-start"
    >
      <span class="body-m text-slate-600">Rows per page:</span>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="tertiary" size="sm">
            {{ pagination.pageSize }}
            <ChevronRight class="size-4 rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            v-for="size in pageSizeOptions"
            :key="size"
            @click="handlePageSizeChange(size)"
          >
            {{ size }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Pagination controls (Right side) -->
    <div class="flex items-center justify-center gap-1 sm:justify-end">
      <!-- First page (hidden on mobile) -->
      <Button
        v-if="showFirstLast && !isMobile"
        variant="tertiary"
        size="sm"
        layout="iconOnly"
        :disabled="!canGoPrev"
        @click="goToFirstPage"
      >
        <ChevronsLeft class="size-4" />
      </Button>

      <!-- Previous page -->
      <Button
        variant="tertiary"
        size="sm"
        layout="iconOnly"
        :disabled="!canGoPrev"
        @click="goToPrevPage"
      >
        <ChevronLeft class="size-4" />
      </Button>

      <!-- Page numbers -->
      <template v-for="(page, index) in pageNumbers" :key="`page-${index}`">
        <!-- Ellipsis -->
        <span
          v-if="page === 'ellipsis'"
          class="body-m flex h-8 w-8 items-center justify-center text-slate-600"
        >
          ...
        </span>

        <!-- Page number button -->
        <Button
          v-else
          :variant="pagination.page === page ? 'primary' : 'tertiary'"
          size="sm"
          layout="iconOnly"
          @click="goToPage(page)"
        >
          {{ page }}
        </Button>
      </template>

      <!-- Next page -->
      <Button
        variant="tertiary"
        size="sm"
        layout="iconOnly"
        :disabled="!canGoNext"
        @click="goToNextPage"
      >
        <ChevronRight class="size-4" />
      </Button>

      <!-- Last page (hidden on mobile) -->
      <Button
        v-if="showFirstLast && !isMobile"
        variant="tertiary"
        size="sm"
        layout="iconOnly"
        :disabled="!canGoNext"
        @click="goToLastPage"
      >
        <ChevronsRight class="size-4" />
      </Button>
    </div>
  </div>
</template>
