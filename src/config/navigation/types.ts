import type { Component } from 'vue'

/**
 * User roles for RBAC
 */
export type UserRole = 'admin' | 'manager' | 'staff' | 'user'

/**
 * Navigation item configuration
 */
export interface NavItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Icon component */
  icon?: Component
  /** Route path (for RouterLink) */
  to?: string
  /** External URL */
  href?: string
  /** Badge text/count */
  badge?: string | number
  /** Roles that can see this item (empty = all roles) */
  roles?: UserRole[]
  /** Child navigation items (for collapsible menu) */
  children?: NavItem[]
  /** Whether item is disabled */
  disabled?: boolean
}

/**
 * Navigation group (for grouping items with a label)
 */
export interface NavGroup {
  /** Group label (shown as section header) */
  label?: string
  /** Navigation items in this group */
  items: NavItem[]
  /** Roles that can see this group */
  roles?: UserRole[]
}

/**
 * Filter navigation items based on user role
 */
export function filterNavByRole<T extends { roles?: UserRole[]; children?: T[]; to?: string }>(
  items: T[],
  userRole: UserRole,
): T[] {
  return items
    .filter(item => {
      // No roles specified = visible to all
      if (!item.roles || item.roles.length === 0) return true
      return item.roles.includes(userRole)
    })
    .map(item => {
      // Recursively filter children
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterNavByRole(item.children, userRole),
        }
      }
      return item
    })
    .filter(item => {
      // Remove parent items that have no visible children
      if (item.children && item.children.length === 0 && !item.to) {
        return false
      }
      return true
    })
}
