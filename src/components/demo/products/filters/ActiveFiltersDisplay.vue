<script setup lang="ts">
  import { computed } from 'vue'
  import { Badge } from '@/components/ui/badge'

  interface Props {
    category?: string
    sort?: 'asc' | 'desc'
  }

  const props = withDefaults(defineProps<Props>(), {
    category: '',
    sort: 'asc',
  })

  const emit = defineEmits<{
    'update:category': [value: string]
    'update:sort': [value: 'asc' | 'desc']
  }>()

  const hasActiveFilters = computed(() => {
    return props.category || props.sort !== 'asc'
  })
</script>

<template>
  <div v-if="hasActiveFilters" class="scrollbar-none flex gap-2 overflow-x-auto">
    <!-- Active Category Badge -->
    <Badge
      v-if="category"
      variant="secondary"
      class="bg-primary-100 text-primary-700 border-primary-200 flex shrink-0 cursor-pointer items-center gap-1"
    >
      {{ category }}
      <button class="hover:text-primary-900 ml-0.5" @click="emit('update:category', '')">✕</button>
    </Badge>

    <!-- Active Sort Badge -->
    <Badge
      v-if="sort === 'desc'"
      variant="secondary"
      class="bg-secondary-100 text-secondary-700 border-secondary-200 flex shrink-0 cursor-pointer items-center gap-1"
    >
      High to Low
      <button class="hover:text-secondary-900 ml-0.5" @click="emit('update:sort', 'asc')">✕</button>
    </Badge>
  </div>
</template>
