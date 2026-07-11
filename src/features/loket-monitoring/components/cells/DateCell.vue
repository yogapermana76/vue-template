<script setup lang="ts">
  import { computed } from 'vue'
  import { formatDateInTZ } from '@/utils/date'

  const props = defineProps<{ value?: unknown; tz?: string | null }>()

  const EMPTY = '—'

  const formatted = computed(() => {
    if (!props.value) return EMPTY
    const out = formatDateInTZ(String(props.value), 'd MMM yyyy · HH:mm', props.tz)
    return out || String(props.value)
  })
</script>

<template>
  <span class="body-m text-neutral-700 tabular-nums">{{ formatted }}</span>
</template>
