<script setup lang="ts">
  // Previous button - absolute positioned over carousel content
  import { ChevronLeft } from 'lucide-vue-next'
  import { IconButton } from '@/components/ui/button'

  interface Props {
    /** Button disabled state */
    disabled?: boolean
    /** Custom position class (default: top-1/2) */
    positionClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    positionClass: 'top-1/2',
  })

  const emit = defineEmits<{
    click: []
  }>()
</script>

<template>
  <IconButton
    variant="primary"
    size="md"
    :disabled="disabled"
    :class="['absolute left-2 z-10 -translate-y-1/2', props.positionClass]"
    title="Previous slide"
    @click="emit('click')"
  >
    <ChevronLeft />
  </IconButton>
</template>
