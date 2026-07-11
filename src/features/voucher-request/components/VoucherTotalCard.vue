<script setup lang="ts">
  import { ClipboardList } from 'lucide-vue-next'

  defineProps<{
    total: number
  }>()
</script>

<template>
  <div
    class="border-primary-200/70 from-primary-50 to-primary-100/40 flex items-center justify-between rounded-md border bg-linear-to-br px-4 py-3.5"
  >
    <div class="flex items-center gap-2.5">
      <div
        class="bg-primary-100 text-primary-700 flex size-8 items-center justify-center rounded-full"
      >
        <ClipboardList class="size-4" />
      </div>
      <span class="body-m-semibold text-slate-800">Total Voucher</span>
    </div>
    <div class="flex items-baseline gap-1.5 leading-none">
      <span class="text-3xl font-bold text-slate-900 tabular-nums">{{ total }}</span>
      <span class="body-caption-medium text-slate-500">Voucher</span>
    </div>
  </div>
</template>
