import { ref, computed, watch, type ComputedRef, type Ref } from 'vue'
import { useMediaQuery, useStorage } from '@vueuse/core'
import { config } from '@/config'

export interface UseLayoutOptions {
  /** Default sidebar collapsed state for desktop */
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

export interface UseLayoutReturn {
  /** Whether we're on mobile (below breakpoint) */
  isMobile: ComputedRef<boolean>
  /** Whether sidebar is collapsed (desktop only) */
  isCollapsed: Ref<boolean>
  /** Whether mobile sidebar overlay is open */
  isMobileOpen: Ref<boolean>
  /** Toggle sidebar collapsed state (desktop) */
  toggleCollapsed: () => void
  /** Toggle mobile sidebar overlay */
  toggleMobile: () => void
  /** Open mobile sidebar */
  openMobile: () => void
  /** Close mobile sidebar */
  closeMobile: () => void
  /** Sidebar width based on collapsed state */
  sidebarWidth: ComputedRef<number>
  /** Sidebar width as CSS value */
  sidebarWidthPx: ComputedRef<string>
  /** Header height from config */
  headerHeight: number
  /** Header height as CSS value */
  headerHeightPx: string
}

/**
 * Composable for managing dashboard layout state.
 * Handles sidebar collapse/expand on desktop and overlay on mobile.
 * Persists collapsed state to localStorage.
 */
export function useLayout(options: UseLayoutOptions = {}): UseLayoutReturn {
  const {
    defaultCollapsed = false,
    storageKey = 'dashboard-sidebar-collapsed',
    sidebarWidth = config.dashboard.sidebar.width,
    sidebarCollapsedWidth = config.dashboard.sidebar.collapsedWidth,
    mobileBreakpoint = config.dashboard.sidebar.mobileBreakpoint,
    headerHeight = config.dashboard.header.height,
  } = options

  // Check if we're on mobile (below breakpoint)
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`)

  // Persist collapsed state to localStorage (desktop only)
  const isCollapsed = useStorage<boolean>(storageKey, defaultCollapsed)

  // Mobile sidebar overlay state (not persisted)
  const isMobileOpen = ref(false)

  // Auto-close mobile sidebar when switching to desktop
  watch(isMobile, mobile => {
    if (!mobile) {
      isMobileOpen.value = false
    }
  })

  // Toggle collapsed state (desktop)
  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
  }

  // Toggle mobile overlay
  const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  // Open mobile overlay
  const openMobile = () => {
    isMobileOpen.value = true
  }

  // Close mobile overlay
  const closeMobile = () => {
    isMobileOpen.value = false
  }

  // Computed sidebar width based on collapsed state
  const currentSidebarWidth = computed(() => {
    if (isMobile.value) return sidebarWidth
    return isCollapsed.value ? sidebarCollapsedWidth : sidebarWidth
  })

  const sidebarWidthPx = computed(() => `${currentSidebarWidth.value}px`)

  return {
    isMobile,
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    openMobile,
    closeMobile,
    sidebarWidth: currentSidebarWidth,
    sidebarWidthPx,
    headerHeight,
    headerHeightPx: `${headerHeight}px`,
  }
}
