<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  interface Props {
    disabled?: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    click: []
  }>()
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    :disabled="disabled"
    class="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full md:right-6"
    @click="emit('click')"
  >
    <ChevronRight class="size-4" />
    <span class="sr-only">Next slide</span>
  </Button>
</template>
