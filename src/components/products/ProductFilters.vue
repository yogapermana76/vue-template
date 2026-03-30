<script setup lang="ts">
  import { computed } from 'vue'
  import { SlidersHorizontal, ArrowUpDown } from 'lucide-vue-next'
  import { SearchInput } from '@/components/shared'
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
    <!-- Search -->
    <SearchInput
      :model-value="search"
      placeholder="Search products..."
      @update:model-value="emit('update:search', $event)"
    />

    <!-- Filters Row -->
    <div class="flex items-center gap-2">
      <!-- Category Select -->
      <Select
        :model-value="category || 'all'"
        @update:model-value="val => emit('update:category', val === 'all' ? '' : String(val))"
      >
        <SelectTrigger class="h-9 flex-1 text-xs">
          <SlidersHorizontal class="mr-1.5 size-3.5" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- Sort Select -->
      <Select
        :model-value="sort"
        @update:model-value="val => emit('update:sort', val as 'asc' | 'desc')"
      >
        <SelectTrigger class="h-9 flex-1 text-xs">
          <ArrowUpDown class="mr-1.5 size-3.5" />
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Low to High</SelectItem>
          <SelectItem value="desc">High to Low</SelectItem>
        </SelectContent>
      </Select>

      <!-- Reset Button -->
      <Button
        v-if="hasActiveFilters"
        variant="ghost"
        size="sm"
        class="h-9 px-2 text-xs"
        @click="handleReset"
      >
        Reset
      </Button>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="scrollbar-none flex gap-2 overflow-x-auto">
      <Badge v-if="search" variant="secondary" class="shrink-0 gap-1 text-xs">
        {{ search }}
        <button class="hover:text-foreground ml-1" @click="emit('update:search', '')">
          &times;
        </button>
      </Badge>
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
  </div>
</template>
