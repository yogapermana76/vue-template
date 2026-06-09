<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
    sortable?: boolean
    sorted?: 'asc' | 'desc' | false
    align?: 'left' | 'center' | 'right'
    /** Enable vertical sticky positioning (top: 0) */
    stickyHeader?: boolean
    /** Whether table is scrolled vertically (adds shadow and z-index) */
    isScrolled?: boolean
    /** Whether this column has sticky positioning (handled by useStickyColumns) */
    isStickyColumn?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    sortable: false,
    sorted: false,
    align: 'left',
    stickyHeader: false,
    isScrolled: false,
    isStickyColumn: false,
  })

  const emit = defineEmits<{
    sort: []
  }>()

  const handleClick = () => {
    if (props.sortable) {
      emit('sort')
    }
  }

  /**
   * Whether to apply sticky top-0 positioning from TableHead
   * Sticky columns (left/right) get positioning from useStickyColumns instead
   */
  const shouldApplyStickyTop = computed(() => {
    return props.stickyHeader && !props.isStickyColumn
  })

  /** Sort icon component based on current sort state */
  const sortIcon = computed(() => {
    if (!props.sortable) return null
    if (props.sorted === 'asc') return ArrowUp
    if (props.sorted === 'desc') return ArrowDown
    return ArrowUpDown
  })
</script>

<template>
  <th
    data-slot="table-head"
    :data-sortable="sortable"
    :data-sorted="sorted"
    :data-align="align"
    :class="
      cn(
        'h-10 border-b border-neutral-200 bg-neutral-50 px-3 text-left align-middle font-medium text-neutral-600 transition-shadow duration-200',
        !isStickyColumn && 'relative',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        sortable && 'cursor-pointer select-none hover:text-neutral-900',
        shouldApplyStickyTop && 'sticky top-0',
        shouldApplyStickyTop &&
          isScrolled &&
          'z-40 bg-white! shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]',
        props.class,
      )
    "
    @click="handleClick"
  >
    <div
      :class="
        cn(
          'flex items-center gap-2',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end',
        )
      "
    >
      <slot />
      <component
        :is="sortIcon"
        v-if="sortIcon"
        class="size-4 transition-colors"
        :class="sorted === false ? 'text-neutral-400' : 'text-neutral-700'"
      />
    </div>
  </th>
</template>
