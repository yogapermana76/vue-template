<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterView, useRouter } from 'vue-router'
  import {
    DashboardLayout,
    DashboardSidebar,
    LayoutHeader,
    DashboardSidebarContent,
    DashboardHeaderContent,
    DashboardBreadcrumb,
    SidebarLogoutButton,
  } from '@/components/layout'
  import { dashboardNavGroups, type UserRole } from '@/config/navigation'
  import { LoketScanDialog, LoketScanTriggerButton, useLoketScanModal } from '@/features/loket-scan'
  import { useLoketAuthStore } from '@/stores'
  import { useToast } from '@/composables/ui'

  const scanModal = useLoketScanModal()
  const router = useRouter()
  const auth = useLoketAuthStore()
  const { success: toastSuccess } = useToast()

  // Loket returns free-form role names; unknown roles fall back to `staff` (read-only).
  const mapLoketRole = (loketRoleName: string | null): UserRole => {
    if (!loketRoleName) return 'staff'
    const name = loketRoleName.toUpperCase()
    if (name.includes('ADMIN')) return 'admin'
    if (name.includes('MANAGER') || name.includes('SUPERVISOR')) return 'manager'
    if (name.includes('USER')) return 'user'
    return 'staff'
  }

  const currentUser = computed(() => ({
    name: auth.user?.FullName ?? '—',
    email: auth.user?.Email ?? '',
    role: mapLoketRole(auth.roleName),
    avatar: undefined as string | undefined,
  }))

  const handleLogout = () => {
    auth.logout()
    toastSuccess('Berhasil keluar')
    router.replace('/login')
  }
</script>

<template>
  <DashboardLayout>
    <template #sidebar>
      <DashboardSidebar logo="/src/assets/images/pln-mobile-logo.png" title="Loket Lifestyle">
        <template #default="{ collapsed }">
          <DashboardSidebarContent
            :nav-groups="dashboardNavGroups"
            :user-role="currentUser.role"
            :collapsed="collapsed"
          />
        </template>

        <template #footer="{ collapsed }">
          <SidebarLogoutButton :collapsed="collapsed" @click="handleLogout" />
        </template>
      </DashboardSidebar>
    </template>

    <template #header>
      <LayoutHeader>
        <template #breadcrumb>
          <DashboardBreadcrumb />
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <LoketScanTriggerButton />
            <DashboardHeaderContent
              :user-name="currentUser.name"
              :user-email="currentUser.email"
              :user-role="currentUser.role"
              :user-avatar="currentUser.avatar"
              @logout="handleLogout"
            />
          </div>
        </template>
      </LayoutHeader>
    </template>

    <RouterView />

    <!-- Mounted at layout root so it survives page changes. -->
    <LoketScanDialog v-model:open="scanModal.open.value" :program-id="scanModal.programId.value" />
  </DashboardLayout>
</template>
