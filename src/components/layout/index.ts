export { default as AppLayout } from './AppLayout.vue'
export { default as Header } from './Header.vue'
export { default as BottomNav } from './BottomNav.vue'
export { default as HeaderActionItem } from './HeaderActionItem.vue'
export { default as Footer } from './Footer.vue'
export { default as GradientSection } from './GradientSection.vue'
export { default as HeroBanner } from './HeroBanner.vue'

// Dashboard layout components
export {
  // Main components
  DashboardLayout,
  DashboardSidebar,
  LayoutHeader,
  UserDropdown,
  // Dashboard content components
  DashboardSidebarContent,
  DashboardFooterContent,
  DashboardHeaderContent,
  DashboardBreadcrumb,
  // Atomic components
  SidebarHeader,
  SidebarFooter,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarNavItemCollapsible,
  SidebarNavDropdown,
  SidebarToggle,
  // Utils
  layoutKey,
  // Types
  type SidebarNavItemType,
  type LayoutContext,
  type SidebarProps,
  type LayoutHeaderProps,
  type DashboardLayoutProps,
  type UserDropdownProps,
} from './dashboard'
