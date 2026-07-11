<script setup lang="ts">
  import { PageHeader } from '@/components/layout'
  import {
    dashboardQuickActions,
    dashboardRecentActivity,
    dashboardRoleAccess,
    dashboardStats,
    QuickActionsCard,
    RecentActivityCard,
    RoleAccessNote,
    StatsGrid,
  } from '@/features/admin-examples/dashboard'

  definePage({
    meta: {
      breadcrumb: 'Dashboard Overview',
    },
  })
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

    <StatsGrid :stats="dashboardStats" />

    <div class="grid gap-4 lg:grid-cols-2">
      <RecentActivityCard :items="dashboardRecentActivity" />
      <QuickActionsCard :actions="dashboardQuickActions" />
    </div>

    <RoleAccessNote :roles="dashboardRoleAccess" />
  </div>
</template>
