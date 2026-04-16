<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { Ticket } from 'lucide-vue-next'

  export type StockBadgeVariant = 'success' | 'danger'
  export type StockBadgeIcon = 'ticket' | 'none'

  interface Props {
    variant?: StockBadgeVariant
    icon?: Component | StockBadgeIcon | null
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'success',
    icon: 'ticket',
  })

  const iconComponent = computed(() => {
    if (!props.icon) return null
    if (typeof props.icon === 'string') {
      if (props.icon === 'none') return null
      const iconMap: Record<string, Component> = {
        ticket: Ticket,
      }
      return iconMap[props.icon] || null
    }
    return props.icon
  })

  const variantClasses: Record<StockBadgeVariant, string> = {
    success: 'bg-green-500',
    danger: 'bg-red-500',
  }
</script>

<template>
  <div
    :class="
      cn(
        'inline-flex items-center justify-center gap-0.5 rounded-tl-xs px-2 py-1 shadow-sm',
        variantClasses[variant],
        props.class,
      )
    "
  >
    <component :is="iconComponent" v-if="iconComponent" class="size-3 shrink-0 text-white" />
    <span class="body-small-semibold whitespace-nowrap text-white">
      <slot />
    </span>
  </div>
</template>
