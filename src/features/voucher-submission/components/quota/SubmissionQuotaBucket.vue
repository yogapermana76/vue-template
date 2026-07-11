<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    label: string
    used: number
    total?: number
  }>()

  const ratio = computed(() => {
    if (!props.total || props.total <= 0) return 0
    return Math.min(1, props.used / props.total)
  })
</script>

<template>
  <div
    class="flex min-w-0 flex-col gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/15"
  >
    <span
      class="text-xxs truncate font-semibold tracking-wider text-white/70 uppercase"
      :title="label"
    >
      {{ label }}
    </span>
    <span class="text-xl leading-none font-bold text-white tabular-nums">{{ used }}</span>
    <div
      v-if="total"
      class="h-1 w-full overflow-hidden rounded-full bg-white/15"
      aria-hidden="true"
    >
      <div
        class="h-full rounded-full bg-white/80 transition-all duration-500"
        :style="{ width: `${ratio * 100}%` }"
      />
    </div>
  </div>
</template>
