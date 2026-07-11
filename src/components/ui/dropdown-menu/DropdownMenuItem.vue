<script setup lang="ts">
  import type { DropdownMenuItemProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { DropdownMenuItem, useForwardProps } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = withDefaults(
    defineProps<
      DropdownMenuItemProps & {
        class?: HTMLAttributes['class']
        inset?: boolean
        variant?: 'default' | 'destructive'
      }
    >(),
    {
      variant: 'default',
    },
  )

  const delegatedProps = reactiveOmit(props, 'inset', 'variant', 'class')

  const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwardedProps"
    :class="
      cn(
        'data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-900 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
