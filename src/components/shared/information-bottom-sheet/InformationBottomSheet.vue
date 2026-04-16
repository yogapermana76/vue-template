<script setup lang="ts">
  import { computed } from 'vue'
  import { BottomSheet } from '@/components/ui/bottom-sheet'

  export interface InformationBottomSheetProps {
    /** Whether the bottom sheet is open */
    open?: boolean
    /** Title text */
    title: string
    /** Description text */
    description: string
    /** Allow dismissing by backdrop click or escape key */
    dismissible?: boolean
  }

  const props = withDefaults(defineProps<InformationBottomSheetProps>(), {
    open: false,
    dismissible: true,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })
</script>

<template>
  <BottomSheet v-model:open="isOpen" :dismissible="dismissible" :show-close="false" :title="title">
    <p class="body-caption text-neutral-80">{{ description }}</p>
  </BottomSheet>
</template>
