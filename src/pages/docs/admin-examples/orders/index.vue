<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Plus } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Home', to: '/docs/admin-examples/overview' }, { label: 'Orders' }],
    },
  })

  import { Button } from '@/components/ui/button'
  import { PageHeader } from '@/components/layout'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import { DataTable, TableActions } from '@/components/ui/table'
  import { formatCurrency } from '@/utils/currency'
  import { formatDate } from '@/utils/date'
  import { useResourceTableActions } from '@/composables/ui'
  import {
    createOrderColumns,
    OrderCustomerCell,
    OrderListToolbar,
    OrderStatusBadge,
    orderPaymentMethodLabel,
    useOrdersList,
    type Order,
  } from '@/features/admin-examples/orders'

  const router = useRouter()
  const crud = useOrdersList()
  const columns = createOrderColumns()

  const amount = (v: number) => formatCurrency(v, 'USD')
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const goToDetail = (order: Order) => router.push(`/docs/admin-examples/orders/${order.id}`)
  const goToEdit = (order: Order) =>
    router.push(`/docs/admin-examples/orders/${order.id}?mode=edit`)
  const goToCreate = () => router.push('/docs/admin-examples/orders/new')

  const { rowActions, deleteButtons } = useResourceTableActions<Order>({
    handlers: {
      // Detail + edit both route (no in-place dialog) — the composable
      // doesn't care whether the handler navigates or opens a dialog.
      view: goToDetail,
      edit: goToEdit,
      delete: crud.openDelete,
    },
    labels: { confirmDelete: 'Delete order' },
    deleting: crud.deleteLoading,
    onConfirmDelete: crud.confirmDelete,
    onCancelDelete: () => (crud.confirmOpen.value = false),
  })
</script>

<template>
  <PageHeader title="Orders" subtitle="View and manage customer orders">
    <template #actions>
      <Button variant="primary" size="md" @click="goToCreate">
        <Plus class="size-4" />
        New order
      </Button>
    </template>
  </PageHeader>

  <DataTable
    :data="crud.filteredOrders.value"
    :columns="columns"
    :loading="crud.loading.value"
    bordered
    selectable
    pagination
    clickable-rows
    striped
    row-key="id"
    :selected-rows="crud.selectedRows.value"
    @update:selected-rows="v => (crud.selectedRows.value = v as string[])"
    @row-click="goToDetail"
  >
    <template #toolbar>
      <OrderListToolbar
        v-model="crud.statusFilter.value"
        v-model:payment="crud.paymentFilter.value"
        v-model:search="crud.searchQuery.value"
      />
    </template>

    <template #cell-id="{ row }">
      <span class="body-m-semibold text-primary-700">{{ (row as Order).id }}</span>
    </template>

    <template #cell-customer="{ row }">
      <OrderCustomerCell :order="row as Order" />
    </template>

    <template #cell-payment="{ row }">
      {{ orderPaymentMethodLabel[(row as Order).paymentMethod] }}
    </template>

    <template #cell-total="{ value }">
      <span class="body-m-semibold">{{ amount(value as number) }}</span>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-status="{ row }">
      <OrderStatusBadge :status="(row as Order).status" />
    </template>

    <template #cell-actions="{ row }">
      <TableActions :actions="rowActions(row as Order)" @click.stop />
    </template>
  </DataTable>

  <ConfirmDialog
    v-model:open="crud.confirmOpen.value"
    variant="danger"
    title="Delete order?"
    :description="
      crud.deletingOrder.value
        ? `Order “${crud.deletingOrder.value.id}” will be permanently removed. This action cannot be undone.`
        : ''
    "
    :buttons="deleteButtons"
  />
</template>
