<script setup lang="ts">
  import type { TooltipContentEmits, TooltipContentProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { TooltipArrow, TooltipContent, TooltipPortal, useForwardPropsEmits } from 'reka-ui'
  import { cn } from '@/utils/cn'

  export type TooltipVariant = 'default' | 'info'

  defineOptions({
    inheritAttrs: false,
  })

  const props = withDefaults(
    defineProps<
      TooltipContentProps & {
        class?: HTMLAttributes['class']
        variant?: TooltipVariant
      }
    >(),
    {
      sideOffset: 6,
      variant: 'default',
    },
  )

  const emits = defineEmits<TooltipContentEmits>()

  const delegatedProps = reactiveOmit(props, 'class', 'variant')
  const forwarded = useForwardPropsEmits(delegatedProps, emits)

  const variantClasses: Record<TooltipVariant, string> = {
    default: 'bg-neutral-700 text-white',
    info: 'bg-info-500 text-white',
  }

  const arrowVariantClasses: Record<TooltipVariant, string> = {
    default: 'bg-neutral-700 fill-neutral-700',
    info: 'bg-info-500 fill-info-500',
  }
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      data-slot="tooltip-content"
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'text-xxs z-50 w-fit rounded-lg px-2 py-1 text-balance',
          variantClasses[variant],
          props.class,
        )
      "
    >
      <slot />

      <TooltipArrow
        :class="
          cn('z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45', arrowVariantClasses[variant])
        "
      />
    </TooltipContent>
  </TooltipPortal>
</template>
