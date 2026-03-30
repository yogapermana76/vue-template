<script setup lang="ts">
  import { ref } from 'vue'
  import {
    FilterChips,
    ActiveFiltersDisplay,
    CategoryFilterBottomSheet,
    SortFilterBottomSheet,
  } from './filters'

  interface Props {
    search?: string
    category?: string
    sort?: 'asc' | 'desc'
    categories?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    search: '',
    category: '',
    sort: 'asc',
    categories: () => [],
  })

  const emit = defineEmits<{
    'update:search': [value: string]
    'update:category': [value: string]
    'update:sort': [value: 'asc' | 'desc']
    reset: []
  }>()

  const isCategoryOpen = ref(false)
  const isSortOpen = ref(false)

  const handleReset = () => {
    emit('update:search', '')
    emit('update:category', '')
    emit('update:sort', 'asc')
    emit('reset')
  }
</script>

<template>
  <div class="space-y-3">
    <!-- Filter Chips (Search + Buttons) -->
    <FilterChips
      :search="search"
      :category="category"
      :sort="sort"
      @update:search="emit('update:search', $event)"
      @open:category="isCategoryOpen = true"
      @open:sort="isSortOpen = true"
      @reset="handleReset"
    />

    <!-- Active Filters Display (Removable Tags) -->
    <ActiveFiltersDisplay
      :category="category"
      :sort="sort"
      @update:category="emit('update:category', $event)"
      @update:sort="emit('update:sort', $event)"
    />

    <!-- Category Selection Modal -->
    <CategoryFilterBottomSheet
      v-model:open="isCategoryOpen"
      :category="category"
      :categories="categories"
      @update:category="emit('update:category', $event)"
    />

    <!-- Sort Selection Modal -->
    <SortFilterBottomSheet
      v-model:open="isSortOpen"
      :sort="sort"
      @update:sort="emit('update:sort', $event)"
    />
  </div>
</template>
