<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { RoundedOverlap } from '@/components/ui'
  import { cn } from '@/utils/cn'
  import LightningGlowIcon from '@/assets/vectors/lightning-glow.svg?component'
  import ellipseGlowSvg from '@/assets/vectors/ellipse-glow.png'

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
    /**
     * Show or hide the ellipse glow at bottom
     * @default false
     */
    showEllipseGlow?: boolean
    /**
     * Custom ellipse glow image source
     * If not provided, uses default ellipse-glow.png
     */
    ellipseGlowSrc?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    gradient: 'navy',
    roundedBottom: true,
    showEllipseGlow: false,
    ellipseGlowSrc: ellipseGlowSvg,
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
    <!-- Ellipse Glow at Bottom (z-0 = paling bawah) -->
    <div v-if="showEllipseGlow" class="pointer-events-none absolute bottom-0 left-0 z-0 w-full">
      <img :src="props.ellipseGlowSrc" alt="" class="h-auto w-full object-cover" />
    </div>

    <!-- Lightning Glow Vector -->
    <LightningGlowIcon class="absolute -top-35 -right-20" />

    <!-- Slot for hero content -->
    <slot />

    <!-- Rounded Bottom Shape -->
    <RoundedOverlap v-if="roundedBottom" />
  </div>
</template>
