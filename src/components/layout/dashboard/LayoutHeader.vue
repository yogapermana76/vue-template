<script setup lang="ts">
  import { computed, inject } from 'vue'
  import { Menu, PanelLeftClose, PanelLeft } from 'lucide-vue-next'
  import { IconButton } from '@/components/ui/button'
  import { config } from '@/config'
  import { layoutKey } from './types'
  import { cn } from '@/utils/cn'

  export interface HeaderProps {
    /** Page title */
    title?: string
    /** Header height in px */
    height?: number
    /** Sidebar width in px */
    sidebarWidth?: number
    /** Collapsed sidebar width in px */
    sidebarCollapsedWidth?: number
  }

  const props = withDefaults(defineProps<HeaderProps>(), {
    height: config.dashboard.header.height,
    sidebarWidth: config.dashboard.sidebar.width,
    sidebarCollapsedWidth: config.dashboard.sidebar.collapsedWidth,
  })

  const layout = inject(layoutKey)

  const isMobile = computed(() => layout?.isMobile.value ?? false)

  // Header positioning style (accounts for sidebar width on desktop)
  const headerStyle = computed(() => {
    const baseStyle = { height: `${props.height}px` }

    if (!layout || layout.isMobile.value) {
      return { ...baseStyle, left: '0', right: '0' }
    }

    const leftOffset = layout.isCollapsed.value ? props.sidebarCollapsedWidth : props.sidebarWidth
    return {
      ...baseStyle,
      left: `${leftOffset}px`,
    }
  })

  const handleMenuClick = () => {
    layout?.openMobile()
  }

  const handleToggleCollapse = () => {
    layout?.toggleCollapsed()
  }
</script>

<template>
  <header
    :class="
      cn(
        'fixed top-0 right-0 z-30 flex items-center gap-2 px-4',
        // Glass / frosted background — modern floating look
        'bg-background/70 backdrop-blur-md backdrop-saturate-150',
        'border-b border-white/40 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]',
        'transition-all duration-300',
      )
    "
    :style="headerStyle"
  >
    <!-- Mobile Menu Button -->
    <IconButton v-if="isMobile" variant="tertiary" size="sm" @click="handleMenuClick">
      <Menu class="h-5 w-5" />
    </IconButton>

    <!-- Desktop Collapse Button -->
    <IconButton v-if="!isMobile" variant="tertiary" size="sm" @click="handleToggleCollapse">
      <component :is="layout?.isCollapsed.value ? PanelLeft : PanelLeftClose" class="h-5 w-5" />
    </IconButton>

    <!-- Left Section -->
    <div class="flex shrink-0 items-center gap-2">
      <h1 v-if="title" class="text-foreground text-lg font-semibold">
        {{ title }}
      </h1>
      <slot name="left" />
    </div>

    <!-- Breadcrumb Section -->
    <div class="flex min-w-0 flex-1 items-center">
      <slot name="breadcrumb" />
    </div>

    <!-- Center Section -->
    <div class="flex items-center justify-center">
      <slot name="center" />
    </div>

    <!-- Right Section -->
    <div class="flex shrink-0 items-center gap-2">
      <slot name="right" />
    </div>
  </header>
</template>
