<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Home', to: '/docs/admin-examples/overview' },
        { label: 'User Management' },
      ],
    },
  })

  import { Button } from '@/components/ui/button'
  import { PageHeader } from '@/components/layout'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import { DataTable, TableActions } from '@/components/ui/table'
  import { formatDate } from '@/utils/date'
  import { useResourceTableActions } from '@/composables/ui'
  import {
    createUserColumns,
    UserDetailDialog,
    UserFormDialog,
    UserListToolbar,
    UserNameCell,
    UserStatusBadge,
    userRoleLabel,
    useUsersCrud,
    type User,
  } from '@/features/admin-examples/users'

  const crud = useUsersCrud()
  const columns = createUserColumns()

  const date = (v?: string) => (v ? formatDate(v, 'dd MMM yyyy') : '—')

  const editFromDetail = (user: User) => {
    crud.detailOpen.value = false
    crud.openEdit(user)
  }

  const deleteFromDetail = (user: User) => {
    crud.detailOpen.value = false
    crud.openDelete(user)
  }

  const { rowActions, deleteButtons } = useResourceTableActions<User>({
    handlers: {
      view: crud.openDetail,
      edit: crud.openEdit,
      delete: crud.openDelete,
    },
    labels: { confirmDelete: 'Delete user' },
    deleting: crud.deleteLoading,
    onConfirmDelete: crud.confirmDelete,
    onCancelDelete: () => (crud.confirmOpen.value = false),
  })
</script>

<template>
  <PageHeader title="Users" subtitle="Invite, edit, and manage team members">
    <template #actions>
      <Button variant="primary" size="md" @click="crud.openCreate">
        <Plus class="size-4" />
        Invite user
      </Button>
    </template>
  </PageHeader>

  <DataTable
    :data="crud.filteredUsers.value"
    :columns="columns"
    :loading="crud.loading.value"
    bordered
    selectable
    pagination
    clickable-rows
    striped
    row-key="id"
    :selected-rows="crud.selectedRows.value"
    @update:selected-rows="v => (crud.selectedRows.value = v as number[])"
    @row-click="crud.openDetail"
  >
    <template #toolbar>
      <UserListToolbar
        v-model="crud.statusFilter.value"
        v-model:role="crud.roleFilter.value"
        v-model:search="crud.searchQuery.value"
      />
    </template>

    <template #cell-name="{ row }">
      <UserNameCell :user="row as User" />
    </template>

    <template #cell-role="{ row }">
      <span class="body-m-medium">{{ userRoleLabel[(row as User).role] }}</span>
    </template>

    <template #cell-joinedAt="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-lastLoginAt="{ value }">
      <span class="text-neutral-600">{{ date(value as string | undefined) }}</span>
    </template>

    <template #cell-status="{ row }">
      <UserStatusBadge :status="(row as User).status" />
    </template>

    <template #cell-actions="{ row }">
      <TableActions :actions="rowActions(row as User)" @click.stop />
    </template>
  </DataTable>

  <UserDetailDialog
    v-model:open="crud.detailOpen.value"
    :user="crud.detailUser.value"
    @edit="editFromDetail"
    @delete="deleteFromDetail"
  />

  <UserFormDialog
    v-model:open="crud.formOpen.value"
    v-model:form="crud.form.value"
    :mode="crud.formMode.value"
    :loading="crud.formSaving.value"
    @submit="crud.submitForm"
  />

  <ConfirmDialog
    v-model:open="crud.confirmOpen.value"
    variant="danger"
    title="Delete user?"
    :description="
      crud.deletingUser.value
        ? `“${crud.deletingUser.value.name}” will lose access immediately. This action cannot be undone.`
        : ''
    "
    :buttons="deleteButtons"
  />
</template>
