<script setup lang="ts">
  import { AlertCircle } from 'lucide-vue-next'
  import { ProgramSwitcher } from '@/features/dashboard'
  import type { Program } from '@/types/services'

  defineProps<{
    programs: Program[]
    modelValue?: number
    loading?: boolean
  }>()

  defineEmits<{
    'update:modelValue': [value: number | undefined]
  }>()
</script>

<template>
  <div class="flex min-h-64 flex-col items-center justify-center gap-4 py-10 text-center">
    <span
      class="bg-warning-100 text-warning-700 flex size-12 items-center justify-center rounded-full"
    >
      <AlertCircle class="size-6" />
    </span>
    <div class="max-w-sm">
      <p class="body-l-semibold text-neutral-950">Pilih program terlebih dulu</p>
      <p class="body-m mt-1 text-neutral-600">
        Program yang dipilih akan tersimpan untuk sesi ini — scan berikutnya langsung menuju program
        yang sama.
      </p>
    </div>
    <div class="w-full max-w-md">
      <ProgramSwitcher
        :programs="programs"
        :model-value="modelValue"
        :loading="loading"
        @update:model-value="v => $emit('update:modelValue', v)"
      />
    </div>
  </div>
</template>
