<script setup lang="ts">
  import { computed } from 'vue'
  import { IconButton } from '@/components/ui/button'
  import { Minus, Plus } from 'lucide-vue-next'
  import { VOUCHER_MAX_PER_CATEGORY } from '../constants'

  const props = defineProps<{
    label: string
    modelValue: number
    max?: number
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const maxValue = computed(() => props.max ?? VOUCHER_MAX_PER_CATEGORY)

  const canDecrement = computed(() => !props.disabled && props.modelValue > 0)
  const canIncrement = computed(() => !props.disabled && props.modelValue < maxValue.value)

  const decrement = () => {
    if (!canDecrement.value) return
    emit('update:modelValue', props.modelValue - 1)
  }

  const increment = () => {
    if (!canIncrement.value) return
    emit('update:modelValue', props.modelValue + 1)
  }
</script>

<template>
  <div
    class="hover:border-primary-200 flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-2.5 transition-colors"
  >
    <span class="body-m-medium text-slate-800">{{ label }}</span>

    <div class="flex items-center gap-3">
      <IconButton
        variant="tertiary"
        size="sm"
        class="rounded-full!"
        aria-label="Kurangi"
        :disabled="!canDecrement"
        @click="decrement"
      >
        <Minus class="size-4 text-slate-600" />
      </IconButton>

      <span class="body-m-semibold w-6 text-center text-slate-900 tabular-nums">
        {{ modelValue }}
      </span>

      <IconButton
        variant="tertiary"
        size="sm"
        class="rounded-full!"
        aria-label="Tambah"
        :disabled="!canIncrement"
        @click="increment"
      >
        <Plus class="size-4 text-slate-600" />
      </IconButton>
    </div>
  </div>
</template>
