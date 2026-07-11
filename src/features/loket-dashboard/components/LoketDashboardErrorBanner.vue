<script setup lang="ts">
  import { AlertCircle, RefreshCcw } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  defineProps<{ message: string }>()
  defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="border-error-200 bg-error-50 flex flex-wrap items-start gap-3 rounded-md border p-4">
    <span
      class="bg-error-100 text-error-700 flex size-9 shrink-0 items-center justify-center rounded-md"
    >
      <AlertCircle class="size-4" />
    </span>
    <div class="flex-1 flex-col gap-0.5">
      <p class="body-m-semibold text-error-800">Gagal memuat data</p>
      <p class="body-caption text-error-700">{{ message }}</p>
    </div>
    <Button variant="secondary" size="sm" @click="$emit('retry')">
      <RefreshCcw class="size-3.5" />
      Coba lagi
    </Button>
  </div>
</template>
