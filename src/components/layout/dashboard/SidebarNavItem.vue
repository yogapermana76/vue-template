<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
  import { cn } from '@/utils/cn'

  interface Props {
    /** Route path */
    to?: string
    /** External link */
    href?: string
    /** Icon component */
    icon?: Component
    /** Label text */
    label: string
    /** Whether sidebar is collapsed */
    collapsed?: boolean
    /** Whether item is disabled */
    disabled?: boolean
    /** Whether this is a child item (nested in collapsible) */
    isChild?: boolean
    /** Custom variant for styling (default: dark for gradient sidebar) */
    variant?: 'dark' | 'light'
  }

  const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
    disabled: false,
    isChild: false,
    variant: 'dark',
  })

  const emit = defineEmits<{
    click: []
  }>()

  const route = useRoute()

  // Auto-detect active state from route. Match exact path OR any descendant
  // (e.g. /voucher-submission stays active on /voucher-submission/46).
  const isActive = computed(() => {
    if (!props.to) return false
    return route.path === props.to || route.path.startsWith(`${props.to}/`)
  })

  // Styling based on variant
  const itemClass = computed(() => {
    const baseClass = cn(
      'flex w-full items-center rounded-lg transition-all duration-200 text-left',
      props.collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
      props.disabled && 'pointer-events-none opacity-50',
    )

    // Dark variant (for gradient sidebar - white text on dark bg)
    if (props.variant === 'dark') {
      return cn(
        baseClass,
        props.isChild
          ? [
              // Child (nested under a collapsible parent). Dot indicator handled in template.
              'text-white/60 hover:bg-white/8 hover:text-white text-sm',
              isActive.value && 'bg-white/5 text-white font-semibold',
            ]
          : [
              // Parent — prototype-style gradient wash + left accent bar
              'text-white/80 hover:bg-white/10 hover:text-white',
              isActive.value &&
                'bg-linear-to-r from-primary-400/25 to-primary-400/5 text-white font-semibold shadow-[inset_3px_0_0_var(--color-primary-400)]',
            ],
      )
    }

    // Light variant (for light sidebar - dark text on light bg)
    return cn(
      baseClass,
      props.isChild
        ? [
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground text-sm',
            isActive.value && 'bg-accent text-accent-foreground font-medium',
          ]
        : [
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            isActive.value && 'bg-accent text-accent-foreground font-medium',
          ],
    )
  })

  const handleClick = () => {
    if (!props.disabled) {
      emit('click')
    }
  }
</script>

<template>
  <!-- Collapsed with Tooltip (skip for child items) -->
  <Tooltip v-if="collapsed && !isChild" :delay-duration="0">
    <TooltipTrigger as-child>
      <component
        :is="to ? RouterLink : href ? 'a' : 'button'"
        :to="to"
        :href="href"
        :class="itemClass"
        :disabled="disabled"
        @click="handleClick"
      >
        <component :is="icon" v-if="icon" class="h-5 w-5 shrink-0" />
      </component>
    </TooltipTrigger>
    <TooltipContent side="right" :side-offset="8">
      <p>{{ label }}</p>
    </TooltipContent>
  </Tooltip>

  <!-- Expanded or Child Item -->
  <component
    v-else
    :is="to ? RouterLink : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :class="itemClass"
    :disabled="disabled"
    @click="handleClick"
  >
    <!-- Icon (for parent items) -->
    <component :is="icon" v-if="icon" class="h-5 w-5 shrink-0" />

    <!--
      Dot indicator for CHILD items only.
      - Active: solid teal dot with a soft glow.
      - Inactive: hollow ring so the "column of dots" stays aligned across siblings.
    -->
    <span
      v-if="isChild && !icon"
      aria-hidden="true"
      :class="[
        'shrink-0 rounded-full transition-all duration-200',
        isActive
          ? 'bg-primary-400 ring-primary-400/25 size-1.5 ring-3'
          : 'size-1.5 border border-white/25 bg-transparent',
      ]"
    />

    <span class="flex-1 truncate">{{ label }}</span>
    <!-- Slot for badge or any custom content on the right -->
    <slot name="right" />
  </component>
</template>
