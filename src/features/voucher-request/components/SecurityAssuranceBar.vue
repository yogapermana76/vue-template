<script setup lang="ts">
  import { ShieldCheck } from 'lucide-vue-next'
  import type { VoucherSecurityAssurance } from '../types'

  defineProps<{
    items: VoucherSecurityAssurance[]
  }>()
</script>

<template>
  <div
    class="border-primary-100 from-primary-50/60 to-primary-50/20 flex flex-col gap-x-6 gap-y-3 rounded-md border bg-linear-to-r px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:flex-col lg:items-stretch lg:justify-start lg:gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4"
  >
    <div v-for="item in items" :key="item.id" class="flex min-w-0 items-center gap-2">
      <div
        class="bg-primary-100 text-primary-700 flex size-6 shrink-0 items-center justify-center rounded-full"
      >
        <ShieldCheck class="size-3.5" />
      </div>
      <span class="body-caption-medium text-slate-600">{{ item.label }}</span>
    </div>
  </div>
</template>
