<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { NumberStepper } from '@/components/ui/number-stepper'

  interface TicketQuantitySelectorProps {
    modelValue?: number
    label: string
    price: number | string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    class?: string
  }

  interface TicketQuantitySelectorEmits {
    (e: 'update:modelValue', value: number): void
    (e: 'increment', value: number): void
    (e: 'decrement', value: number): void
    (e: 'change', value: number): void
  }

  const props = withDefaults(defineProps<TicketQuantitySelectorProps>(), {
    modelValue: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    disabled: false,
  })

  const emit = defineEmits<TicketQuantitySelectorEmits>()

  const formattedPrice = computed(() => {
    if (typeof props.price === 'string') return props.price

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(props.price)
  })

  const handleUpdate = (value: number) => {
    emit('update:modelValue', value)
  }

  const handleIncrement = (value: number) => {
    emit('increment', value)
  }

  const handleDecrement = (value: number) => {
    emit('decrement', value)
  }

  const handleChange = (value: number) => {
    emit('change', value)
  }

  const containerClasses = computed(() => {
    return cn('flex flex-row justify-between items-center gap-2', 'w-full', props.class)
  })
</script>

<template>
  <div :class="containerClasses" data-slot="ticket-quantity-selector">
    <!-- Label Section -->
    <div class="flex flex-col items-start justify-center gap-0.5">
      <!-- Ticket Type Label -->
      <span class="leading-xs text-xs font-normal text-slate-800/75">
        {{ label }}
      </span>

      <!-- Price -->
      <span class="leading-xs text-xs font-bold text-slate-950">
        {{ formattedPrice }}
      </span>
    </div>

    <!-- Number Stepper -->
    <NumberStepper
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      @update:model-value="handleUpdate"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @change="handleChange"
    />
  </div>
</template>
