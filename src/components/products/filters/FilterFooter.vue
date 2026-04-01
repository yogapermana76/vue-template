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
    <Button
      variant="secondary"
      class="flex-1 border-neutral-300 text-neutral-600 hover:bg-neutral-50"
      @click="onCancel"
    >
      Cancel
    </Button>
    <Button
      variant="primary"
      size="md"
      class="bg-primary-500 hover:bg-primary-600 flex-1 text-white"
      @click="emit('apply')"
    >
      Apply
    </Button>
  </div>
</template>
