<script setup lang="ts">
  import { Ticket } from 'lucide-vue-next'

  defineProps<{
    name: string
    used: number
    total: number
  }>()
</script>

<template>
  <div class="flex min-w-0 items-center gap-3">
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 backdrop-blur-sm"
    >
      <Ticket class="size-5 text-white" />
    </span>
    <div class="flex min-w-0 flex-col leading-tight">
      <span class="body-l-semibold truncate text-white">{{ name }}</span>
      <span class="body-caption text-white/70 tabular-nums">
        {{ used }}
        <span class="text-white/40">/ {{ total }} voucher</span>
      </span>
    </div>
  </div>
</template>
