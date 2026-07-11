<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Plus } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Home', to: '/docs/admin-examples/overview' }, { label: 'Invoices' }],
    },
  })

  import { Button } from '@/components/ui/button'
  import { PageHeader } from '@/components/layout'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import { DataTable, TableActions } from '@/components/ui/table'
  import { formatCurrency, type CurrencyCode } from '@/utils/currency'
  import { formatDate } from '@/utils/date'
  import { useResourceTableActions } from '@/composables/ui'
  import {
    createInvoiceColumns,
    InvoiceListToolbar,
    InvoiceStatusBadge,
    useInvoicesList,
    type Invoice,
  } from '@/features/admin-examples/invoices'

  const router = useRouter()
  const crud = useInvoicesList()
  const columns = createInvoiceColumns()

  // Cast at boundary: Invoice.currency is loose string, formatCurrency wants CurrencyCode.
  const money = (v: number, c: string) => formatCurrency(v, c as CurrencyCode)
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const goToDetail = (invoice: Invoice) =>
    router.push(`/docs/admin-examples/invoices/${invoice.id}`)

  const { rowActions, deleteButtons } = useResourceTableActions<Invoice>({
    handlers: {
      // Detail is a route, not a dialog; edit happens on the detail page.
      view: goToDetail,
      delete: crud.openDelete,
    },
    labels: { confirmDelete: 'Delete invoice' },
    deleting: crud.deleteLoading,
    onConfirmDelete: crud.confirmDelete,
    onCancelDelete: () => (crud.confirmOpen.value = false),
  })
</script>

<template>
  <PageHeader title="Invoices" subtitle="Bill clients and track payments">
    <template #actions>
      <Button variant="primary" size="md" disabled>
        <Plus class="size-4" />
        New invoice
      </Button>
    </template>
  </PageHeader>

  <DataTable
    :data="crud.filteredInvoices.value"
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
      <InvoiceListToolbar
        v-model="crud.statusFilter.value"
        v-model:search="crud.searchQuery.value"
      />
    </template>

    <template #cell-number="{ row }">
      <div class="min-w-0">
        <p class="body-m-semibold text-primary-700 font-mono">{{ (row as Invoice).number }}</p>
        <p class="body-caption text-muted-foreground">
          Issued {{ date((row as Invoice).issueDate) }}
        </p>
      </div>
    </template>

    <template #cell-client="{ row }">
      <div class="min-w-0">
        <p class="body-m-medium text-foreground truncate">{{ (row as Invoice).clientName }}</p>
        <p class="body-caption text-muted-foreground truncate">
          {{ (row as Invoice).clientEmail }}
        </p>
      </div>
    </template>

    <template #cell-issueDate="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-dueDate="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-total="{ row }">
      <span class="body-m-semibold">
        {{ money((row as Invoice).total, (row as Invoice).currency) }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <InvoiceStatusBadge :status="(row as Invoice).status" />
    </template>

    <template #cell-actions="{ row }">
      <TableActions :actions="rowActions(row as Invoice)" />
    </template>
  </DataTable>

  <ConfirmDialog
    v-model:open="crud.confirmOpen.value"
    variant="danger"
    title="Delete invoice?"
    :description="
      crud.deleting.value
        ? `Invoice ${crud.deleting.value.number} for ${crud.deleting.value.clientName} will be permanently deleted.`
        : ''
    "
    :buttons="deleteButtons"
  />
</template>
