<script setup lang="ts">
  import { computed } from 'vue'
  import { Progress } from '@/components/ui/progress'

  const props = defineProps<{
    used: number
    total: number
  }>()

  const percent = computed(() => {
    if (!props.total) return 0
    return Math.min(100, Math.round((props.used / props.total) * 100))
  })
</script>

<template>
  <div class="flex shrink-0 flex-col items-end gap-1.5">
    <span class="body-caption-medium text-white tabular-nums">{{ percent }}%</span>
    <Progress :model-value="percent" tone="onDark" class="w-24" />
  </div>
</template>
