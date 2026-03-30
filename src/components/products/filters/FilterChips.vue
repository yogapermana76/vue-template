<script setup lang="ts">
  import { computed } from 'vue'
  import { SearchInput } from '@/components/shared'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'

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

  const categoryLabel = computed(() => {
    return props.category || 'All'
  })

  const sortLabel = computed(() => {
    return props.sort === 'asc' ? 'Low to High' : 'High to Low'
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

    <!-- Filter Chips (using Badge as button) -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Category Filter Chip -->
      <Badge
        as="button"
        variant="outline"
        class="hover:bg-accent cursor-pointer"
        @click="emit('open:category')"
      >
        <span class="font-medium">Category:</span>
        <span class="text-muted-foreground ml-1">{{ categoryLabel }}</span>
      </Badge>

      <!-- Sort Filter Chip -->
      <Badge
        as="button"
        variant="outline"
        class="hover:bg-accent cursor-pointer"
        @click="emit('open:sort')"
      >
        <span class="font-medium">Sort:</span>
        <span class="text-muted-foreground ml-1">{{ sortLabel }}</span>
      </Badge>

      <!-- Reset Button -->
      <Button v-if="hasActiveFilters" variant="ghost" size="sm" @click="emit('reset')">
        Reset
      </Button>
    </div>
  </div>
</template>
