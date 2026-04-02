<script setup lang="ts">
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { PillTab } from '@/components/ui/pill-tab'
  import FilterFooter from './FilterFooter.vue'

  interface Props {
    open?: boolean
    category?: string
    categories?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
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

  const getCategoryState = (cat: string) => {
    return (cat === 'All' && !props.category) || cat === props.category ? 'active' : 'default'
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
    <div class="flex flex-wrap items-center gap-2">
      <PillTab
        v-for="cat in ['All', ...categories]"
        :key="cat"
        as="button"
        :state="getCategoryState(cat)"
        class="cursor-pointer"
        @click="handleSelectCategory(cat)"
      >
        {{ cat }}
      </PillTab>
    </div>
    <template #footer>
      <FilterFooter :on-cancel="handleCancel" @apply="handleApply" />
    </template>
  </BottomSheet>
</template>
