<script setup lang="ts">
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { Button } from '@/components/ui/button'
  import FilterFooter from './FilterFooter.vue'

  interface Props {
    open?: boolean
    sort?: 'asc' | 'desc'
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    sort: 'asc',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    'update:sort': [value: 'asc' | 'desc']
  }>()

  const handleSelectSort = (sortValue: 'asc' | 'desc') => {
    emit('update:sort', sortValue)
  }

  const handleCancel = () => {
    emit('update:open', false)
  }

  const handleApply = () => {
    emit('update:open', false)
  }
</script>

<template>
  <BottomSheet
    :open="open"
    title="Sort By Price"
    has-footer
    footer-position="sticky"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-2">
      <Button
        :variant="sort === 'asc' ? 'default' : 'outline'"
        :class="[
          'w-full justify-start',
          sort === 'asc'
            ? 'bg-primary-500 hover:bg-primary-600 text-white'
            : 'hover:border-primary-300 hover:bg-primary-50 border-neutral-300 text-neutral-700',
        ]"
        @click="handleSelectSort('asc')"
      >
        Low to High
      </Button>
      <Button
        :variant="sort === 'desc' ? 'default' : 'outline'"
        :class="[
          'w-full justify-start',
          sort === 'desc'
            ? 'bg-primary-500 hover:bg-primary-600 text-white'
            : 'hover:border-primary-300 hover:bg-primary-50 border-neutral-300 text-neutral-700',
        ]"
        @click="handleSelectSort('desc')"
      >
        High to Low
      </Button>
    </div>
    <template #footer>
      <FilterFooter :on-cancel="handleCancel" @apply="handleApply" />
    </template>
  </BottomSheet>
</template>
