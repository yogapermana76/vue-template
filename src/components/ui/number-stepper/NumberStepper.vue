<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { IconButton } from '@/components/ui/button'
  import { Minus, Plus } from 'lucide-vue-next'

  interface NumberStepperProps {
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    class?: string
  }

  interface NumberStepperEmits {
    (e: 'update:modelValue', value: number): void
    (e: 'increment', value: number): void
    (e: 'decrement', value: number): void
    (e: 'change', value: number): void
  }

  const props = withDefaults(defineProps<NumberStepperProps>(), {
    modelValue: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    disabled: false,
  })

  const emit = defineEmits<NumberStepperEmits>()

  const canDecrement = computed(() => {
    return !props.disabled && props.modelValue > props.min
  })

  const canIncrement = computed(() => {
    return !props.disabled && props.modelValue < props.max
  })

  const handleDecrement = () => {
    if (!canDecrement.value) return

    const newValue = Math.max(props.min, props.modelValue - props.step)
    emit('update:modelValue', newValue)
    emit('decrement', newValue)
    emit('change', newValue)
  }

  const handleIncrement = () => {
    if (!canIncrement.value) return

    const newValue = Math.min(props.max, props.modelValue + props.step)
    emit('update:modelValue', newValue)
    emit('increment', newValue)
    emit('change', newValue)
  }

  const containerClasses = computed(() => {
    return cn(
      // Base layout
      'inline-flex flex-row items-center gap-2 p-1',
      // Sizing
      'h-8',
      // Background & border
      'bg-white border border-slate-200 rounded-xl',
      // Disabled state
      props.disabled && 'opacity-50 cursor-not-allowed',
      // Custom classes
      props.class,
    )
  })
</script>

<template>
  <div :class="containerClasses" data-slot="number-stepper">
    <IconButton
      variant="tertiary"
      size="sm"
      :disabled="!canDecrement"
      title="Decrease"
      @click="handleDecrement"
    >
      <Minus :size="16" class="text-neutral-600" />
    </IconButton>

    <span
      class="min-w-6 text-center text-sm leading-5 font-semibold text-slate-800 select-none"
      data-slot="value"
    >
      {{ modelValue }}
    </span>

    <IconButton
      variant="tertiary"
      size="sm"
      :disabled="!canIncrement"
      title="Increase"
      @click="handleIncrement"
    >
      <Plus :size="16" class="text-neutral-600" />
    </IconButton>
  </div>
</template>
