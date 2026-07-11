<script setup lang="ts">
  import type { DropdownMenuSubTriggerProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { ChevronRight } from 'lucide-vue-next'
  import { DropdownMenuSubTrigger, useForwardProps } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<
    DropdownMenuSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }
  >()

  const delegatedProps = reactiveOmit(props, 'class', 'inset')
  const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuSubTrigger
    data-slot="dropdown-menu-sub-trigger"
    v-bind="forwardedProps"
    :data-inset="inset ? '' : undefined"
    :class="
      cn(
        'data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-900 data-inset:pl-8 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
  >
    <slot />
    <ChevronRight class="ml-auto size-4" />
  </DropdownMenuSubTrigger>
</template>
