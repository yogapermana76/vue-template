<script setup lang="ts">
  import { computed } from 'vue'
  import { Loader2 } from 'lucide-vue-next'

  interface Props {
    pullDistance: number
    isRefreshing: boolean
    threshold?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    threshold: 80,
  })

  const progress = computed(() => Math.min(props.pullDistance / props.threshold, 1))

  const indicatorStyle = computed(() => ({
    transform: `translateY(${props.pullDistance - 40}px)`,
    opacity: props.pullDistance > 10 ? 1 : 0,
  }))

  const iconRotation = computed(() => ({
    transform: `rotate(${progress.value * 360}deg)`,
  }))
</script>

<template>
  <div
    v-if="pullDistance > 0 || isRefreshing"
    class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
    :style="indicatorStyle"
  >
    <div class="bg-background flex size-10 items-center justify-center rounded-full shadow-lg">
      <Loader2 v-if="isRefreshing" class="text-primary size-5 animate-spin" />
      <div v-else class="text-primary transition-transform" :style="iconRotation">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>
