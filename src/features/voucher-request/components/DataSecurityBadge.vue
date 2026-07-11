<script setup lang="ts">
  import { ShieldCheck } from 'lucide-vue-next'

  withDefaults(
    defineProps<{
      label?: string
    }>(),
    { label: 'Data Anda aman bersama kami' },
  )
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
  >
    <ShieldCheck class="text-primary-600 size-4" />
    <span class="body-caption-medium text-slate-600">{{ label }}</span>
  </span>
</template>
