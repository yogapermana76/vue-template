<script setup lang="ts">
  import { RouterView, useRouter } from 'vue-router'
  import {
    DashboardLayout,
    DashboardSidebar,
    LayoutHeader,
    DashboardSidebarContent,
    DashboardFooterContent,
    DashboardHeaderContent,
    DashboardBreadcrumb,
  } from '@/components/layout'
  import { dashboardNavGroups, dashboardFooterItems, type UserRole } from '@/config/navigation'

  const router = useRouter()

  // Simulated user data - in real app, get from auth store
  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin' as UserRole,
    avatar: undefined, // Optional: Add avatar URL here
  }

  // Handlers
  const handleLogout = () => {
    // In real app, call auth store logout
    router.push('/demo/examples/login')
  }

  const handleSettings = () => {
    router.push('/admin/settings')
  }

  const handleHelp = () => {
    router.push('/admin/help')
  }
</script>

<template>
  <DashboardLayout>
    <!-- Sidebar -->
    <template #sidebar>
      <DashboardSidebar logo="/src/assets/images/pln-mobile-logo.png" title="BOT Lifestyle">
        <!-- Navigation Content -->
        <template #default="{ collapsed }">
          <DashboardSidebarContent
            :nav-groups="dashboardNavGroups"
            :user-role="currentUser.role"
            :collapsed="collapsed"
          />
        </template>

        <!-- Footer Content -->
        <template #footer="{ collapsed }">
          <DashboardFooterContent
            :footer-items="dashboardFooterItems"
            :user-role="currentUser.role"
            :user-name="currentUser.name"
            :user-email="currentUser.email"
            :user-avatar="currentUser.avatar"
            :collapsed="collapsed"
            @logout="handleLogout"
          />
        </template>
      </DashboardSidebar>
    </template>

    <!-- Header -->
    <template #header>
      <LayoutHeader>
        <template #breadcrumb>
          <DashboardBreadcrumb />
        </template>
        <template #right>
          <DashboardHeaderContent
            :user-name="currentUser.name"
            :user-email="currentUser.email"
            :user-role="currentUser.role"
            :user-avatar="currentUser.avatar"
            @logout="handleLogout"
            @settings="handleSettings"
            @help="handleHelp"
          />
        </template>
      </LayoutHeader>
    </template>

    <!-- Main Content -->
    <RouterView />
  </DashboardLayout>
</template>
