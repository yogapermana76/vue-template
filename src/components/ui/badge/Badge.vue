<script setup lang="ts">
  import type { PrimitiveProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import type { BadgeVariants } from '.'
  import { reactiveOmit } from '@vueuse/core'
  import { Primitive } from 'reka-ui'
  import { cn } from '@/utils/cn'
  import { badgeVariants } from '.'

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        variant?: BadgeVariants['variant']
        /** Show a leading colored dot (matches prototype `.badge::before`) */
        dot?: boolean
        class?: HTMLAttributes['class']
      }
    >(),
    {
      dot: false,
    },
  )

  const delegatedProps = reactiveOmit(props, 'class', 'dot')
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="cn(badgeVariants({ variant }), props.class)"
    v-bind="delegatedProps"
  >
    <span
      v-if="dot"
      aria-hidden="true"
      class="inline-block size-1.5 shrink-0 rounded-full bg-current opacity-90"
    />
    <slot />
  </Primitive>
</template>
