<script setup lang="ts">
  import type { CheckboxRootProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { Check, Minus } from 'lucide-vue-next'
  import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<
    CheckboxRootProps & {
      class?: HTMLAttributes['class']
      checked?: boolean | 'indeterminate'
    }
  >()

  const emit = defineEmits<{
    'update:checked': [value: boolean | 'indeterminate']
  }>()

  const isIndeterminate = computed(() => props.checked === 'indeterminate')
</script>

<template>
  <CheckboxRoot
    v-slot="slotProps"
    v-bind="props"
    data-slot="checkbox"
    :model-value="checked"
    @update:model-value="value => emit('update:checked', value)"
    :class="
      cn(
        'peer size-4 shrink-0 rounded border border-neutral-200 bg-white shadow-xs transition-shadow outline-none',
        'hover:bg-primary-50 hover:border-primary-600',
        'focus-visible:border-primary-200 focus-visible:ring-primary-50 focus-visible:ring-4',
        'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=checked]:text-white',
        'data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 data-[state=indeterminate]:text-white',
        'disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:data-[state=checked]:border-neutral-200 disabled:data-[state=checked]:bg-neutral-100 disabled:data-[state=checked]:text-neutral-500',
        'aria-invalid:ring-error-500/20 aria-invalid:border-error-500',
        props.class,
      )
    "
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="flex items-center justify-center text-current"
    >
      <slot v-bind="slotProps">
        <Minus v-if="isIndeterminate" class="size-3" />
        <Check v-else class="size-3" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
