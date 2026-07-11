<script setup lang="ts">
  import { AlertCircle } from 'lucide-vue-next'
  import { LoketProgramSwitcher } from '@/features/loket-dashboard'
  import type { LoketProgram } from '@/types/services/loket'

  defineProps<{
    programs?: LoketProgram[]
    loading?: boolean
  }>()

  defineEmits<{
    'update:programId': [id: number | undefined]
  }>()
</script>

<template>
  <div
    class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center"
  >
    <span
      class="bg-warning-500/20 text-warning-300 flex size-16 items-center justify-center rounded-lg"
    >
      <AlertCircle class="size-8" />
    </span>
    <p class="body-l-semibold text-white">Pilih program terlebih dulu</p>
    <p class="body-m max-w-xs text-neutral-400">
      Program yang dipilih akan tersimpan — scan berikutnya langsung ke program yang sama.
    </p>
    <div class="w-full max-w-sm">
      <LoketProgramSwitcher
        variant="dark"
        :programs="programs ?? []"
        :loading="loading"
        @update:model-value="v => $emit('update:programId', v)"
      />
    </div>
  </div>
</template>
