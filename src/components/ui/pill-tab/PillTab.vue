<script setup lang="ts">
  import type { PrimitiveProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import type { PillTabVariants } from '.'
  import { reactiveOmit } from '@vueuse/core'
  import { Primitive } from 'reka-ui'
  import { cn } from '@/utils/cn'
  import { pillTabVariants } from '.'

  const props = defineProps<
    PrimitiveProps & {
      state?: PillTabVariants['state']
      class?: HTMLAttributes['class']
    }
  >()

  const delegatedProps = reactiveOmit(props, 'class', 'state')
</script>

<template>
  <Primitive
    data-slot="pill-tab"
    :class="cn(pillTabVariants({ state }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
