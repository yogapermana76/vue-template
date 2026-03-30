<script setup lang="ts">
  import { ChevronLeft } from 'lucide-vue-next'
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
    class="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full md:left-6"
    @click="emit('click')"
  >
    <ChevronLeft class="size-4" />
    <span class="sr-only">Previous slide</span>
  </Button>
</template>
