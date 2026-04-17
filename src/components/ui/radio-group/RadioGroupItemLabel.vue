<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { RadioGroupItem } from '.'

  interface RadioGroupItemLabelProps {
    /** Item value for radio button */
    value: string | number
    /** Item label text */
    label: string
    /** Whether this item is selected */
    selected?: boolean
    /** Custom class for label wrapper */
    class?: HTMLAttributes['class']
    /** Custom class for label text */
    labelClass?: HTMLAttributes['class']
  }

  const props = defineProps<RadioGroupItemLabelProps>()

  const emit = defineEmits<{
    click: [value: string | number]
  }>()

  const handleClick = () => {
    emit('click', props.value)
  }
</script>

<template>
  <label
    :class="
      cn(
        'flex cursor-pointer items-center gap-3 rounded-sm border border-neutral-200 bg-white px-3 py-3 transition-all',
        'hover:border-primary-600',
        props.selected && 'border-primary-600 bg-primary-50',
        props.class,
      )
    "
  >
    <RadioGroupItem :value="String(value)" @click="handleClick" />
    <span :class="cn('body-m flex-1 text-neutral-950', labelClass)">{{ label }}</span>
  </label>
</template>
