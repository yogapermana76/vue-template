<script setup lang="ts">
  import { computed } from 'vue'
  import { Ban, Download, Plus, Trash2 } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Home', to: '/docs/admin-examples/overview' }, { label: 'Vouchers' }],
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
    createVoucherColumns,
    useVouchersCrud,
    VoucherDetailSheet,
    VoucherFormSheet,
    VoucherListToolbar,
    VoucherStatusBadge,
    voucherKindLabel,
    type Voucher,
  } from '@/features/admin-examples/vouchers'

  const crud = useVouchersCrud()
  const columns = createVoucherColumns()

  const money = (v: number) => formatCurrency(v, 'USD')
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const valueLabel = (voucher: Voucher) => {
    if (voucher.kind === 'percentage') return `${voucher.amount}%`
    if (voucher.kind === 'shipping') return 'Free shipping'
    return money(voucher.amount)
  }

  const editFromDetail = (voucher: Voucher) => {
    crud.detailOpen.value = false
    crud.openEdit(voucher)
  }

  const { rowActions, deleteButtons } = useResourceTableActions<Voucher>({
    handlers: {
      view: crud.openDetail,
      edit: crud.openEdit,
      delete: crud.openDelete,
    },
    labels: { confirmDelete: 'Delete voucher' },
    deleting: crud.deleteLoading,
    onConfirmDelete: crud.confirmDelete,
    onCancelDelete: () => (crud.confirmOpen.value = false),
  })

  const hasSelection = computed(() => crud.selectedRows.value.length > 0)
</script>

<template>
  <PageHeader title="Vouchers" subtitle="Discount codes, campaigns, and promotions">
    <template #actions>
      <Button variant="secondary" size="md" @click="crud.exportCsv">
        <Download class="size-4" />
        Export CSV
      </Button>
      <Button variant="primary" size="md" @click="crud.openCreate">
        <Plus class="size-4" />
        New voucher
      </Button>
    </template>
  </PageHeader>

  <div
    v-if="hasSelection"
    class="border-primary-200 bg-primary-50 mb-3 flex items-center gap-3 rounded-md border px-4 py-2.5"
  >
    <span class="body-m-medium text-primary-800">
      {{ crud.selectedRows.value.length }} voucher(s) selected
    </span>
    <div class="ml-auto flex items-center gap-2">
      <Button
        variant="warning"
        soft
        size="sm"
        :loading="crud.bulkLoading.value"
        @click="crud.bulkDisable"
      >
        <Ban class="size-4" />
        Disable
      </Button>
      <Button
        variant="danger"
        soft
        size="sm"
        :loading="crud.bulkLoading.value"
        @click="crud.bulkDelete"
      >
        <Trash2 class="size-4" />
        Delete
      </Button>
    </div>
  </div>

  <DataTable
    :data="crud.filteredVouchers.value"
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
    @row-click="crud.openDetail"
  >
    <template #toolbar>
      <VoucherListToolbar
        v-model="crud.statusFilter.value"
        v-model:kind="crud.kindFilter.value"
        v-model:start-from="crud.startDateFrom.value"
        v-model:start-to="crud.startDateTo.value"
        v-model:search="crud.searchQuery.value"
      />
    </template>

    <template #cell-code="{ row }">
      <div class="min-w-0">
        <p class="body-m-semibold text-primary-700 font-mono">{{ (row as Voucher).code }}</p>
        <p class="body-caption text-muted-foreground truncate">
          {{ (row as Voucher).description }}
        </p>
      </div>
    </template>

    <template #cell-kind="{ row }">
      {{ voucherKindLabel[(row as Voucher).kind] }}
    </template>

    <template #cell-amount="{ row }">
      <span class="body-m-semibold">{{ valueLabel(row as Voucher) }}</span>
    </template>

    <template #cell-usage="{ row }">
      <span class="body-m-medium">
        {{ (row as Voucher).usageCount }} /
        <span class="text-neutral-500">{{ (row as Voucher).usageLimit }}</span>
      </span>
    </template>

    <template #cell-startsAt="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-endsAt="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-status="{ row }">
      <VoucherStatusBadge :status="(row as Voucher).status" />
    </template>

    <template #cell-actions="{ row }">
      <TableActions :actions="rowActions(row as Voucher)" />
    </template>
  </DataTable>

  <VoucherDetailSheet
    v-model:open="crud.detailOpen.value"
    :voucher="crud.detailVoucher.value"
    @edit="editFromDetail"
  />

  <VoucherFormSheet
    v-model:open="crud.formOpen.value"
    v-model:form="crud.form.value"
    :mode="crud.formMode.value"
    :loading="crud.formSaving.value"
    @submit="crud.submitForm"
  />

  <ConfirmDialog
    v-model:open="crud.confirmOpen.value"
    variant="danger"
    title="Delete voucher?"
    :description="
      crud.deleting.value
        ? `Voucher ${crud.deleting.value.code} will be removed. Users can no longer redeem it.`
        : ''
    "
    :buttons="deleteButtons"
  />
</template>
