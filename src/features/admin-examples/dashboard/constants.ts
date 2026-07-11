import { BarChart3, CreditCard, FileText, Package, Settings, Users } from 'lucide-vue-next'
import type { ActivityItem, DashboardStat, QuickAction, RoleAccess } from './types'

export const dashboardStats: DashboardStat[] = [
  {
    title: 'Total Revenue',
    value: 'Rp 45.231.890',
    change: '+20.1%',
    trend: 'up',
    icon: CreditCard,
  },
  {
    title: 'Active Users',
    value: '2,350',
    change: '+180.1%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Total Products',
    value: '12,234',
    change: '+19%',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '-4.5%',
    trend: 'down',
    icon: BarChart3,
  },
]

export const dashboardQuickActions: QuickAction[] = [
  { key: 'products', label: 'View Products', icon: Package, to: '/docs/admin-examples/products' },
  { key: 'users', label: 'Manage Users', icon: Users, to: '/docs/admin-examples/users' },
  { key: 'orders', label: 'View Orders', icon: CreditCard, to: '/docs/admin-examples/orders' },
  { key: 'reports', label: 'View Reports', icon: FileText },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export const dashboardRecentActivity: ActivityItem[] = [
  { id: 1, title: 'User 1 made a purchase', timeAgo: '1 hour ago' },
  { id: 2, title: 'User 2 made a purchase', timeAgo: '2 hours ago' },
  { id: 3, title: 'User 3 made a purchase', timeAgo: '3 hours ago' },
  { id: 4, title: 'User 4 made a purchase', timeAgo: '4 hours ago' },
  { id: 5, title: 'User 5 made a purchase', timeAgo: '5 hours ago' },
]

export const dashboardRoleAccess: RoleAccess[] = [
  { role: 'admin', description: 'Full access to all menus' },
  { role: 'manager', description: 'Analytics, Products, Orders, Reports' },
  { role: 'staff', description: 'Products, Orders only' },
  { role: 'user', description: 'Dashboard only' },
]
