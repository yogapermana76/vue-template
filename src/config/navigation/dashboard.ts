import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  BarChart3,
  FileText,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
} from 'lucide-vue-next'
import type { NavItem, NavGroup } from './types'

/**
 * Main navigation items for dashboard sidebar
 */
export const dashboardNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    to: '/dashboard/analytics',
    roles: ['admin', 'manager'],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    roles: ['admin'],
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        to: '/dashboard/users',
      },
      {
        id: 'users-roles',
        label: 'Roles & Permissions',
        to: '/dashboard/users/roles',
      },
      {
        id: 'users-activity',
        label: 'Activity Log',
        to: '/dashboard/users/activity',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    roles: ['admin', 'manager', 'staff'],
    children: [
      {
        id: 'products-list',
        label: 'All Products',
        to: '/dashboard/products',
      },
      {
        id: 'products-categories',
        label: 'Categories',
        to: '/dashboard/products/categories',
        roles: ['admin', 'manager'],
      },
      {
        id: 'products-inventory',
        label: 'Inventory',
        to: '/dashboard/products/inventory',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: CreditCard,
    to: '/dashboard/orders',
    badge: 5,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    to: '/dashboard/reports',
    roles: ['admin', 'manager'],
  },
]

/**
 * Navigation groups for dashboard sidebar
 */
export const dashboardNavGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        to: '/dashboard',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        to: '/dashboard/analytics',
        roles: ['admin', 'manager'],
      },
    ],
  },
  {
    label: 'Management',
    roles: ['admin', 'manager', 'staff'],
    items: [
      {
        id: 'users',
        label: 'Users',
        icon: Users,
        roles: ['admin'],
        children: [
          { id: 'users-list', label: 'All Users', to: '/dashboard/users' },
          { id: 'users-roles', label: 'Roles', to: '/dashboard/users/roles' },
        ],
      },
      {
        id: 'products',
        label: 'Products',
        icon: Package,
        children: [
          { id: 'products-list', label: 'All Products', to: '/dashboard/products' },
          { id: 'products-categories', label: 'Categories', to: '/dashboard/products/categories' },
        ],
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: CreditCard,
        to: '/dashboard/orders',
        badge: 5,
      },
    ],
  },
  {
    label: 'System',
    roles: ['admin'],
    items: [
      {
        id: 'security',
        label: 'Security',
        icon: Shield,
        to: '/dashboard/security',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        to: '/dashboard/notifications',
      },
    ],
  },
]

/**
 * Footer navigation items
 */
export const dashboardFooterItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    to: '/dashboard/settings',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    to: '/dashboard/help',
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
  },
]
