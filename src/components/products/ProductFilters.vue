<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { SlidersHorizontal } from 'lucide-vue-next'
  import { SearchInput } from '@/components/shared'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'

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

  const isFilterOpen = ref(false)

  const hasActiveFilters = computed(() => {
    return props.search || props.category || props.sort !== 'asc'
  })

  const handleReset = () => {
    emit('update:search', '')
    emit('update:category', '')
    emit('update:sort', 'asc')
    emit('reset')
  }
</script>

<template>
  <div class="space-y-3">
    <!-- Search + Filter Button -->
    <div class="flex items-center gap-2">
      <SearchInput
        :model-value="search"
        placeholder="Search products..."
        class="flex-1"
        @update:model-value="emit('update:search', $event)"
      />
      <Button variant="outline" size="icon" class="shrink-0" @click="isFilterOpen = true">
        <SlidersHorizontal class="size-4" />
      </Button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="scrollbar-none flex gap-2 overflow-x-auto">
      <Badge v-if="category" variant="secondary" class="shrink-0 gap-1 text-xs">
        {{ category }}
        <button class="hover:text-foreground ml-1" @click="emit('update:category', '')">
          &times;
        </button>
      </Badge>
      <Badge v-if="sort === 'desc'" variant="secondary" class="shrink-0 gap-1 text-xs">
        High to Low
        <button class="hover:text-foreground ml-1" @click="emit('update:sort', 'asc')">
          &times;
        </button>
      </Badge>
    </div>

    <!-- Bottom Sheet with Filters (for non-search filters) -->
    <BottomSheet v-model:open="isFilterOpen" title="Filters" content-class="max-h-[80vh]">
      <template #trigger />
      <!-- Trigger handled by button above -->

      <div class="space-y-4">
        <!-- Category Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Category</label>
          <Select
            :model-value="category || 'all'"
            @update:model-value="val => emit('update:category', val === 'all' ? '' : String(val))"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Sort Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Sort By</label>
          <Select
            :model-value="sort"
            @update:model-value="val => emit('update:sort', val as 'asc' | 'desc')"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Low to High</SelectItem>
              <SelectItem value="desc">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-4">
          <Button v-if="hasActiveFilters" variant="outline" class="flex-1" @click="handleReset">
            Reset
          </Button>
          <Button class="flex-1" @click="isFilterOpen = false"> Apply Filters </Button>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>
