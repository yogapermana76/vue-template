<script setup lang="ts">
  import { LoketProgramSwitcher } from '@/features/loket-dashboard'
  import type { LoketProgram } from '@/types/services/loket'

  defineProps<{
    programs: LoketProgram[]
    modelValue?: number
    loading?: boolean
  }>()

  defineEmits<{
    'update:modelValue': [value: number | undefined]
  }>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <span class="body-caption-medium tracking-wider text-neutral-500 uppercase"> Program </span>
    <LoketProgramSwitcher
      variant="compact"
      :programs="programs"
      :model-value="modelValue"
      :loading="loading"
      @update:model-value="v => $emit('update:modelValue', v)"
    />
  </div>
</template>
