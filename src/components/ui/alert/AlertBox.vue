<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import type { AlertVariants, AlertVariant } from '.'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { alertVariants } from '.'
  import { Info, CircleCheck, CircleAlert } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      variant?: AlertVariants['variant']
      icon?: Component | boolean
      title?: string
      description?: string
    }>(),
    {
      variant: 'info',
      icon: true,
    },
  )

  const iconComponent = computed(() => {
    if (props.icon === false) return null
    if (props.icon !== true && props.icon) return props.icon

    const iconMap: Record<AlertVariant, Component> = {
      info: Info,
      success: CircleCheck,
      warning: CircleAlert,
      error: CircleAlert,
    }
    return iconMap[props.variant as AlertVariant] || Info
  })
</script>

<template>
  <div data-slot="alert" :class="cn(alertVariants({ variant }), props.class)" role="alert">
    <component
      :is="iconComponent"
      v-if="iconComponent"
      data-slot="alert-icon"
      class="size-5 shrink-0"
    />
    <div class="flex flex-1 flex-col items-start gap-0.5">
      <div v-if="title" class="leading-xs text-xs font-semibold">{{ title }}</div>
      <div v-if="description" class="leading-xs text-xs font-normal">{{ description }}</div>
      <slot />
    </div>
  </div>
</template>
