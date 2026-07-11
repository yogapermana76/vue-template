<script setup lang="ts">
  import { Spinner } from '@/components/ui/spinner'

  defineProps<{ code?: string }>()
</script>

<template>
  <div
    class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-neutral-950/80"
  >
    <Spinner size="lg" tone="white" />
    <p class="body-m text-white">Memverifikasi tiket...</p>
    <p v-if="code" class="body-caption font-mono text-white/60">{{ code }}</p>
  </div>
</template>
