<script setup lang="ts">
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
  <div class="flex flex-wrap items-center justify-between gap-3">
    <span class="body-caption-medium tracking-wider text-neutral-500 uppercase"> Program </span>
    <ProgramSwitcher
      variant="compact"
      :programs="programs"
      :model-value="modelValue"
      :loading="loading"
      @update:model-value="v => $emit('update:modelValue', v)"
    />
  </div>
</template>
