// Dashboard layout components
export {
  // Main components
  DashboardLayout,
  DashboardSidebar,
  LayoutHeader,
  UserDropdown,
  // Dashboard content components
  DashboardSidebarContent,
  DashboardHeaderContent,
  DashboardBreadcrumb,
  PageHeader,
  DetailPageLayout,
  // Atomic components
  SidebarHeader,
  SidebarFooter,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarNavItemCollapsible,
  SidebarNavDropdown,
  SidebarToggle,
  SidebarLogoutButton,
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

// Mobile/webview layout components (Header + HeaderActionItem consumed by QrScanner)
export * from './mobile'
