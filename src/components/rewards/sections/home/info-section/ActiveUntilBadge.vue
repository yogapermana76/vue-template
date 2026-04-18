<script setup lang="ts">
  interface ActiveUntilBadgeProps {
    /** Active until date string */
    activeUntil: string
    /** Loading state */
    isLoading?: boolean
  }

  withDefaults(defineProps<ActiveUntilBadgeProps>(), {
    isLoading: false,
  })
</script>

<template>
  <div
    class="body-caption-semibold mx-4 flex flex-row items-center justify-between gap-1 self-stretch rounded-full bg-[#061D2B] px-4 py-2 text-white backdrop-blur-md"
  >
    <span>Aktif sampai</span>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="h-4 w-24 animate-pulse rounded bg-white/10"></div>
    <!-- Active Until Date -->
    <span v-else>{{ activeUntil }}</span>
  </div>
</template>
