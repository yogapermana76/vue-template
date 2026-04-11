<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { RoundedOverlap } from '@/components/ui'
  import { cn } from '@/utils/cn'

  type GradientVariant = 'navy' | 'cyan' | 'blue-cyan' | 'teal'

  interface Props {
    /**
     * Background gradient variant
     * @default 'navy'
     */
    gradient?: GradientVariant
    /**
     * Additional classes to apply to the hero section container
     * Useful for overriding padding (pt-*, pb-*) or adding custom styles
     */
    class?: HTMLAttributes['class']
    /**
     * Show or hide the rounded bottom shape
     * @default true
     */
    roundedBottom?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    gradient: 'navy',
    roundedBottom: true,
  })

  const gradientClass = computed(() => {
    const gradientMap: Record<GradientVariant, string> = {
      navy: 'bg-gradient-navy',
      cyan: 'bg-gradient-cyan',
      'blue-cyan': 'bg-gradient-blue-cyan',
      teal: 'bg-gradient-teal',
    }
    return gradientMap[props.gradient]
  })
</script>

<template>
  <div
    :class="
      cn('relative flex w-full flex-col overflow-hidden pt-16 pb-5', gradientClass, props.class)
    "
  >
    <!-- Slot for hero content -->
    <slot />

    <!-- Rounded Bottom Shape -->
    <RoundedOverlap v-if="roundedBottom" />
  </div>
</template>
