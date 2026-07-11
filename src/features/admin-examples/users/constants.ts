import type { PillTabItem } from '@/components/ui/pill-tab'
import type { BadgeVariants } from '@/components/ui/badge'
import type { UserRole, UserStatus, UserStatusFilter } from './types'

export const userStatusMeta: Record<
  UserStatus,
  { label: string; variant: BadgeVariants['variant'] }
> = {
  active: { label: 'Active', variant: 'success' },
  invited: { label: 'Invited', variant: 'info' },
  suspended: { label: 'Suspended', variant: 'error' },
}

export const userRoleLabel: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  staff: 'Staff',
}

export const userStatusFilters: PillTabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'invited', label: 'Invited' },
  { key: 'suspended', label: 'Suspended' },
]

export const userRoleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' },
]

export const userStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited' },
  { value: 'suspended', label: 'Suspended' },
]

export const userDepartmentOptions = [
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Finance', label: 'Finance' },
]

export const isUserStatusFilter = (v: string): v is UserStatusFilter =>
  v === 'all' || v === 'active' || v === 'invited' || v === 'suspended'
