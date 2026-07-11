<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import {
    DashboardLayout,
    DashboardSidebar,
    LayoutHeader,
    DashboardSidebarContent,
    DashboardBreadcrumb,
  } from '@/components/layout'
  import { docsNavGroups } from '@/config/navigation'

  // Docs are unauthenticated reference pages; role is unused but required by the API.
  const userRole = 'admin' as const
</script>

<template>
  <DashboardLayout>
    <template #sidebar>
      <DashboardSidebar title="Template docs">
        <template #default="{ collapsed }">
          <DashboardSidebarContent
            :nav-groups="docsNavGroups"
            :user-role="userRole"
            :collapsed="collapsed"
          />
        </template>
      </DashboardSidebar>
    </template>

    <template #header>
      <LayoutHeader>
        <template #breadcrumb>
          <DashboardBreadcrumb />
        </template>
      </LayoutHeader>
    </template>

    <RouterView />
  </DashboardLayout>
</template>
