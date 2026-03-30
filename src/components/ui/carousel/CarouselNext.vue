<script setup lang="ts">
  // Next button - absolute positioned over carousel content
  import { ChevronRight } from 'lucide-vue-next'
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
    variant="outline"
    size="icon"
    :disabled="disabled"
    :class="['absolute right-2 z-10 -translate-y-1/2 rounded-full', props.positionClass]"
    @click="emit('click')"
  >
    <ChevronRight class="size-4" />
    <span class="sr-only">Next slide</span>
  </Button>
</template>
