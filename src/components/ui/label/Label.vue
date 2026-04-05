<script setup lang="ts">
  import type { LabelProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { Label } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

  const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <Label
    data-slot="label"
    v-bind="delegatedProps"
    :class="
      cn(
        'body-m-medium flex items-center gap-1 text-neutral-950 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
