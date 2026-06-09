<script setup lang="ts">
  import { provide, computed } from 'vue'
  import { useLayout, type UseLayoutOptions } from '@/composables/ui/useLayout'
  import { config } from '@/config'
  import { layoutKey } from './types'

  export interface DashboardLayoutProps {
    /** Default sidebar collapsed state */
    defaultCollapsed?: boolean
    /** Storage key for persisting sidebar state */
    storageKey?: string
    /** Sidebar width in px */
    sidebarWidth?: number
    /** Collapsed sidebar width in px */
    sidebarCollapsedWidth?: number
    /** Mobile breakpoint in px */
    mobileBreakpoint?: number
    /** Header height in px */
    headerHeight?: number
  }

  const props = withDefaults(defineProps<DashboardLayoutProps>(), {
    defaultCollapsed: false,
    storageKey: 'dashboard-sidebar-collapsed',
    sidebarWidth: config.dashboard.sidebar.width,
    sidebarCollapsedWidth: config.dashboard.sidebar.collapsedWidth,
    mobileBreakpoint: config.dashboard.sidebar.mobileBreakpoint,
    headerHeight: config.dashboard.header.height,
  })

  // Initialize layout composable
  const layoutOptions: UseLayoutOptions = {
    defaultCollapsed: props.defaultCollapsed,
    storageKey: props.storageKey,
    sidebarWidth: props.sidebarWidth,
    sidebarCollapsedWidth: props.sidebarCollapsedWidth,
    mobileBreakpoint: props.mobileBreakpoint,
    headerHeight: props.headerHeight,
  }

  const {
    isMobile,
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    openMobile,
    closeMobile,
    sidebarWidth: currentSidebarWidth,
    headerHeight: layoutHeaderHeight,
  } = useLayout(layoutOptions)

  // Provide layout context to children
  provide(layoutKey, {
    isMobile,
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    openMobile,
    closeMobile,
    sidebarWidth: currentSidebarWidth,
  })

  // Main content area style (offset for sidebar and header)
  const contentStyle = computed(() => {
    if (isMobile.value) {
      return {
        paddingTop: `${layoutHeaderHeight}px`,
      }
    }
    return {
      marginLeft: `${currentSidebarWidth.value}px`,
      paddingTop: `${layoutHeaderHeight}px`,
    }
  })
</script>

<template>
  <div class="bg-muted/30 min-h-screen">
    <!-- Sidebar Slot -->
    <slot
      name="sidebar"
      :is-mobile="isMobile"
      :is-collapsed="isCollapsed"
      :is-mobile-open="isMobileOpen"
    />

    <!-- Header Slot -->
    <slot name="header" :is-mobile="isMobile" :is-collapsed="isCollapsed" />

    <!-- Main Content -->
    <main class="transition-all duration-300" :style="contentStyle">
      <div class="p-4 md:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
