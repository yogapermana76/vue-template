<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Home', to: '/docs/admin-examples/overview' },
        { label: 'Product Management' },
      ],
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
    createProductColumns,
    ProductDetailSheet,
    ProductFormSheet,
    ProductListToolbar,
    ProductNameCell,
    ProductStatusBadge,
    useProductsCrud,
    type Product,
  } from '@/features/admin-examples/products'

  const crud = useProductsCrud()
  const columns = createProductColumns()

  // Display-only formatters — small enough that a shared utils layer would
  // add indirection without saving lines. Kept inline.
  const price = (v: number) => formatCurrency(v, 'USD')
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')
  const stockClass = (s: number) =>
    s === 0 ? 'text-error-600' : s < 20 ? 'text-warning-600' : 'text-success-600'

  const editFromDetail = (product: Product) => {
    crud.detailOpen.value = false
    crud.openEdit(product)
  }

  const { rowActions, deleteButtons } = useResourceTableActions<Product>({
    handlers: {
      view: crud.openDetail,
      edit: crud.openEdit,
      delete: crud.openDelete,
    },
    deleting: crud.deleteLoading,
    onConfirmDelete: crud.confirmDelete,
    onCancelDelete: () => (crud.confirmOpen.value = false),
  })
</script>

<template>
  <PageHeader title="Products" subtitle="Manage products, prices, and stock">
    <template #actions>
      <Button variant="primary" size="md" @click="crud.openCreate">
        <Plus class="size-4" />
        Add product
      </Button>
    </template>
  </PageHeader>

  <DataTable
    :data="crud.filteredProducts.value"
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
      <ProductListToolbar
        v-model="crud.statusFilter.value"
        v-model:category="crud.categoryFilter.value"
        v-model:search="crud.searchQuery.value"
      />
    </template>

    <template #cell-name="{ row }">
      <ProductNameCell :product="row as Product" />
    </template>

    <template #cell-price="{ value }">
      <span class="body-m-medium">{{ price(value as number) }}</span>
    </template>

    <template #cell-margin="{ value }">
      <span class="body-m-medium text-success-700"> {{ (value as number).toFixed(1) }}% </span>
    </template>

    <template #cell-stock="{ value }">
      <span class="body-m-semibold" :class="stockClass(value as number)">{{ value }}</span>
    </template>

    <template #cell-status="{ row }">
      <ProductStatusBadge :status="(row as Product).status" />
    </template>

    <template #cell-createdAt="{ value }">
      <span class="body-m text-muted-foreground">{{ date(value as string) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <TableActions :actions="rowActions(row as Product)" @click.stop />
    </template>
  </DataTable>

  <ProductDetailSheet
    v-model:open="crud.detailOpen.value"
    :product="crud.detailProduct.value"
    @edit="editFromDetail"
  />

  <ProductFormSheet
    v-model:open="crud.formOpen.value"
    v-model:form="crud.form.value"
    :mode="crud.formMode.value"
    :loading="crud.formSaving.value"
    @submit="crud.submitForm"
  />

  <ConfirmDialog
    v-model:open="crud.confirmOpen.value"
    variant="danger"
    title="Delete product?"
    :description="
      crud.deletingProduct.value
        ? `“${crud.deletingProduct.value.name}” will be permanently removed. This action cannot be undone.`
        : ''
    "
    :buttons="deleteButtons"
  />
</template>
