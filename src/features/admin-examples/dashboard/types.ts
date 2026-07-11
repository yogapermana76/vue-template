import type { Component } from 'vue'

export type StatTrend = 'up' | 'down'

export interface DashboardStat {
  title: string
  value: string
  change: string
  trend: StatTrend
  icon: Component
}

export interface QuickAction {
  key: string
  label: string
  icon: Component
  /** Route path when the action navigates. Omit for click-handled actions. */
  to?: string
}

export interface ActivityItem {
  id: number | string
  title: string
  timeAgo: string
  /** Optional avatar URL. Falls back to a colored placeholder. */
  avatarUrl?: string
}

export interface RoleAccess {
  role: string
  description: string
}
