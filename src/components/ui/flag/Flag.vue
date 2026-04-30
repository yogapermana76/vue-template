<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { CircleCheck, CirclePercent, Ticket, ThumbsUp } from 'lucide-vue-next'

  export type FlagVariant = 'primary' | 'success' | 'danger' | 'info' | 'neutral'
  export type FlagSize = 'sm' | 'md'
  export type FlagIcon = 'check' | 'discount' | 'ticket' | 'thumbs-up'

  interface Props {
    variant?: FlagVariant
    size?: FlagSize
    icon?: Component | FlagIcon | null
    pointer?: boolean
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    icon: null,
    pointer: false,
  })

  const iconComponent = computed(() => {
    if (!props.icon) return null
    if (typeof props.icon === 'string') {
      const iconMap: Record<string, Component> = {
        check: CircleCheck,
        discount: CirclePercent,
        ticket: Ticket,
        'thumbs-up': ThumbsUp,
      }
      return iconMap[props.icon] || null
    }
    return props.icon
  })

  const variantClasses: Record<FlagVariant, string> = {
    primary: 'bg-primary-500 text-white',
    success: 'bg-success-500 text-white',
    danger: 'bg-error-500 text-white',
    info: 'bg-info-500 text-white',
    neutral: 'bg-slate-300 text-white',
  }

  const sizeClasses: Record<FlagSize, string> = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  }

  const iconSizeClasses: Record<FlagSize, string> = {
    sm: 'size-3.5',
    md: 'size-4',
  }

  // Pointer uses darker shade for shadow/fold effect
  const pointerFillClasses: Record<FlagVariant, string> = {
    primary: 'fill-primary-700',
    success: 'fill-success-700',
    danger: 'fill-error-700',
    info: 'fill-info-700',
    neutral: 'fill-slate-700',
  }
</script>

<template>
  <div class="relative inline-flex">
    <span
      :class="
        cn(
          'inline-flex items-center font-semibold whitespace-nowrap',
          pointer ? 'rounded-l-full rounded-tr-xl rounded-br-none' : 'rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          props.class,
        )
      "
    >
      <component :is="iconComponent" v-if="iconComponent" :class="iconSizeClasses[size]" />
      <slot />
    </span>
    <!-- Pointer: SVG triangle at bottom-right corner -->
    <svg
      v-if="pointer"
      class="absolute top-full right-0"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="0,0 12,0 0,10" :class="pointerFillClasses[variant]" />
    </svg>
  </div>
</template>
