<script setup lang="ts">
  import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<
    SwitchRootProps & {
      class?: HTMLAttributes['class']
      checked?: boolean
    }
  >()

  const emits = defineEmits<SwitchRootEmits & { 'update:checked': [value: boolean] }>()

  const delegatedProps = reactiveOmit(props, 'class', 'checked')

  const forwarded = useForwardPropsEmits(delegatedProps, emits)

  function handleUpdateModelValue(value: boolean) {
    emits('update:checked', value)
  }
</script>

<template>
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    v-bind="forwarded"
    :model-value="props.checked"
    @update:model-value="handleUpdateModelValue"
    :class="
      cn(
        'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 shadow-xs transition-all outline-none',
        'data-[state=unchecked]:border-neutral-200 data-[state=unchecked]:bg-neutral-200',
        'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        'hover:data-[state=unchecked]:border-primary-600',
        'focus-visible:ring-primary-50 focus-visible:ring-4',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:data-[state=checked]:bg-neutral-300 disabled:data-[state=unchecked]:bg-neutral-100',
        props.class,
      )
    "
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="
        cn(
          'pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform',
          'data-[state=unchecked]:translate-x-0',
          'data-[state=checked]:translate-x-4',
        )
      "
    >
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchRoot>
</template>
