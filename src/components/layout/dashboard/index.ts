// Main layout components
export { default as DashboardLayout } from './DashboardLayout.vue'
export { default as DashboardSidebar } from './DashboardSidebar.vue'
export { default as LayoutHeader } from './LayoutHeader.vue'
export { default as UserDropdown } from './UserDropdown.vue'

// Dashboard content components
export { default as DashboardSidebarContent } from './DashboardSidebarContent.vue'
export { default as DashboardFooterContent } from './DashboardFooterContent.vue'
export { default as DashboardHeaderContent } from './DashboardHeaderContent.vue'
export { default as DashboardBreadcrumb } from './DashboardBreadcrumb.vue'

// Sidebar atomic components
export { default as SidebarHeader } from './SidebarHeader.vue'
export { default as SidebarFooter } from './SidebarFooter.vue'
export { default as SidebarNavItem } from './SidebarNavItem.vue'
export { default as SidebarNavGroup } from './SidebarNavGroup.vue'
export { default as SidebarNavItemCollapsible } from './SidebarNavItemCollapsible.vue'
export { default as SidebarNavDropdown } from './SidebarNavDropdown.vue'
export { default as SidebarToggle } from './SidebarToggle.vue'

// Types
export type { SidebarNavItem as SidebarNavItemType, LayoutContext } from './types'
export { layoutKey } from './types'
export type { SidebarProps } from './DashboardSidebar.vue'
export type { HeaderProps as LayoutHeaderProps } from './LayoutHeader.vue'
export type { DashboardLayoutProps } from './DashboardLayout.vue'
export type { UserDropdownProps } from './UserDropdown.vue'
