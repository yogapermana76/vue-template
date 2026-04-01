<script setup lang="ts">
  // Previous button - absolute positioned over carousel content
  import { ChevronLeft } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

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
  <Button
    variant="secondary"
    size="md"
    layout="iconOnly"
    :disabled="disabled"
    :class="['absolute left-2 z-10 -translate-y-1/2 rounded-full', props.positionClass]"
    @click="emit('click')"
  >
    <ChevronLeft class="size-4" />
    <span class="sr-only">Previous slide</span>
  </Button>
</template>
