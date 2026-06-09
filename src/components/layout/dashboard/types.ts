import type { InjectionKey, ComputedRef, Ref, Component } from 'vue'

/**
 * Layout context shared between DashboardLayout, DashboardSidebar, and DashboardHeader
 */
export interface LayoutContext {
  isMobile: ComputedRef<boolean>
  isCollapsed: Ref<boolean>
  isMobileOpen: Ref<boolean>
  toggleCollapsed: () => void
  toggleMobile: () => void
  openMobile: () => void
  closeMobile: () => void
  sidebarWidth: ComputedRef<number>
}

export const layoutKey: InjectionKey<LayoutContext> = Symbol('dashboard-layout')

/**
 * Sidebar navigation item
 */
export interface SidebarNavItem {
  id: string
  label: string
  icon?: Component
  to?: string
  href?: string
  onClick?: () => void
  badge?: string | number
  children?: SidebarNavItem[]
  disabled?: boolean
}
