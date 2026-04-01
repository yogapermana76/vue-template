<script setup lang="ts">
  import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { Check } from 'lucide-vue-next'
  import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'] }>()
  const emits = defineEmits<CheckboxRootEmits>()

  const delegatedProps = reactiveOmit(props, 'class')

  const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-slot="slotProps"
    data-slot="checkbox"
    v-bind="forwarded"
    :class="
      cn(
        'peer data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 focus-visible:border-primary-400 focus-visible:ring-primary-400/50 aria-invalid:ring-error-500/20 dark:aria-invalid:ring-error-500/40 aria-invalid:border-error-500 size-4 shrink-0 rounded-lg border border-neutral-300 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white',
        props.class,
      )
    "
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none"
    >
      <slot v-bind="slotProps">
        <Check class="size-3.5" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
