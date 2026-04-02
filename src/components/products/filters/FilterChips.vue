<script setup lang="ts">
  import { computed } from 'vue'
  import { Filter, ArrowUpDown } from 'lucide-vue-next'
  import { SearchInput } from '@/components/shared'
  import { Button } from '@/components/ui/button'
  import { PillTab } from '@/components/ui/pill-tab'

  interface Props {
    search?: string
    category?: string
    sort?: 'asc' | 'desc'
  }

  const props = withDefaults(defineProps<Props>(), {
    search: '',
    category: '',
    sort: 'asc',
  })

  const emit = defineEmits<{
    'update:search': [value: string]
    'open:category': []
    'open:sort': []
    reset: []
  }>()

  const hasActiveFilters = computed(() => {
    return props.search || props.category || props.sort !== 'asc'
  })

  const isCategoryActive = computed(() => {
    return props.category && props.category !== 'All'
  })

  const isSortActive = computed(() => {
    return props.sort !== 'asc'
  })

  const categoryLabel = computed(() => {
    return props.category || 'All'
  })

  const sortLabel = computed(() => {
    return props.sort === 'asc' ? 'Low to High' : 'High to Low'
  })

  const getCategoryState = computed(() => {
    return isCategoryActive.value ? 'filter-active' : 'default'
  })

  const getSortState = computed(() => {
    return isSortActive.value ? 'filter-active' : 'default'
  })
</script>

<template>
  <div class="space-y-3">
    <!-- Search Input -->
    <SearchInput
      :model-value="search"
      placeholder="Search products..."
      @update:model-value="emit('update:search', $event)"
    />

    <!-- Filter Pills (using PillTab) -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Category Filter Pill -->
      <PillTab
        as="button"
        :state="getCategoryState"
        class="cursor-pointer"
        @click="emit('open:category')"
      >
        <Filter class="size-4" />
        Category: <span class="font-semibold">{{ categoryLabel }}</span>
      </PillTab>

      <!-- Sort Filter Pill -->
      <PillTab as="button" :state="getSortState" class="cursor-pointer" @click="emit('open:sort')">
        <ArrowUpDown class="size-4" />
        Sort: <span class="font-semibold">{{ sortLabel }}</span>
      </PillTab>

      <!-- Reset Button -->
      <Button
        v-if="hasActiveFilters"
        variant="tertiary"
        size="sm"
        class="text-error-600 hover:bg-error-50 hover:text-error-700"
        @click="emit('reset')"
      >
        Reset
      </Button>
    </div>
  </div>
</template>
