<script setup lang="ts">
  import { Button } from '@/components/ui/button'

  interface Props {
    onCancel?: () => void
  }

  withDefaults(defineProps<Props>(), {
    onCancel: () => {},
  })

  const emit = defineEmits<{
    apply: []
  }>()
</script>

<template>
  <div class="flex gap-2">
    <Button variant="outline" class="flex-1" @click="onCancel"> Cancel </Button>
    <Button class="flex-1" @click="emit('apply')"> Apply </Button>
  </div>
</template>
