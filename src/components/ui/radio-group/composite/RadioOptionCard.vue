<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { RadioGroupItem } from '..'

  interface Props {
    value: string | number
    title: string
    description?: string
    selected?: boolean
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    click: [value: string | number]
  }>()
</script>

<template>
  <label
    :class="
      cn(
        'flex cursor-pointer items-center gap-3 rounded-sm border border-neutral-200 bg-white p-3 transition-all',
        props.selected && 'border-primary-600 border-2 p-2.75',
        props.class,
      )
    "
  >
    <RadioGroupItem :value="String(value)" @click="emit('click', props.value)" />
    <div class="flex flex-1 flex-col justify-center gap-1">
      <span class="body-m-medium text-slate-950">{{ title }}</span>
      <span v-if="description" class="body-caption text-slate-800/75">{{ description }}</span>
    </div>
  </label>
</template>
