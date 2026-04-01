<script setup lang="ts">
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { Button } from '@/components/ui/button'
  import FilterFooter from './FilterFooter.vue'

  interface Props {
    open?: boolean
    category?: string
    categories?: string[]
  }

  withDefaults(defineProps<Props>(), {
    open: false,
    category: '',
    categories: () => [],
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    'update:category': [value: string]
  }>()

  const handleSelectCategory = (cat: string) => {
    emit('update:category', cat === 'All' ? '' : cat)
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
    title="Select Category"
    has-footer
    footer-position="sticky"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-2">
      <Button
        v-for="cat in ['All', ...categories]"
        :key="cat"
        :variant="(cat === 'All' && !category) || cat === category ? 'primary' : 'secondary'"
        size="md"
        :class="['w-full justify-start']"
        @click="handleSelectCategory(cat)"
      >
        {{ cat }}
      </Button>
    </div>
    <template #footer>
      <FilterFooter :on-cancel="handleCancel" @apply="handleApply" />
    </template>
  </BottomSheet>
</template>
