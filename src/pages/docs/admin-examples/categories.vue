<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Home', to: '/docs/admin-examples/overview' },
        { label: 'Categories' },
      ],
    },
  })

  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { PageHeader } from '@/components/layout'
  import { SearchInput } from '@/components/shared/search-input'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import { DataTable, TableActions } from '@/components/ui/table'
  import { formatDate } from '@/utils/date'
  import { useResourceTableActions } from '@/composables/ui'
  import {
    CategoryFormDialog,
    createCategoryColumns,
    useCategoriesCrud,
    type Category,
  } from '@/features/admin-examples/categories'

  const crud = useCategoriesCrud()
  const columns = createCategoryColumns()

  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const { rowActions, deleteButtons } = useResourceTableActions<Category>({
    handlers: {
      // No `view` — categories don't have a detail sheet; the row-click
      // handler opens edit directly.
      edit: crud.openEdit,
      delete: crud.openDelete,
    },
    labels: { confirmDelete: 'Delete category' },
    deleting: crud.deleteLoading,
    onConfirmDelete: crud.confirmDelete,
    onCancelDelete: () => (crud.confirmOpen.value = false),
  })
</script>

<template>
  <PageHeader title="Categories" subtitle="Organize products into browsable groups">
    <template #actions>
      <Button variant="primary" size="md" @click="crud.openCreate">
        <Plus class="size-4" />
        New category
      </Button>
    </template>
  </PageHeader>

  <DataTable
    :data="crud.filteredCategories.value"
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
    @row-click="crud.openEdit"
  >
    <template #toolbar>
      <div class="flex items-center gap-2 px-4 py-3">
        <SearchInput
          v-model="crud.searchQuery.value"
          size="sm"
          placeholder="Search categories…"
          class="w-full sm:w-64"
        />
        <div class="min-w-0 flex-1" />
      </div>
    </template>

    <template #cell-name="{ row }">
      <div class="min-w-0">
        <p class="body-m-semibold text-foreground truncate">{{ (row as Category).name }}</p>
        <p class="body-caption text-muted-foreground">
          {{ (row as Category).productsCount }} products
        </p>
      </div>
    </template>

    <template #cell-published="{ row }">
      <Badge :variant="(row as Category).isPublished ? 'success' : 'neutral'" dot>
        {{ (row as Category).isPublished ? 'Live' : 'Hidden' }}
      </Badge>
    </template>

    <template #cell-updatedAt="{ value }">
      <span class="text-neutral-600">{{ date(value as string) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <TableActions :actions="rowActions(row as Category)" />
    </template>
  </DataTable>

  <CategoryFormDialog
    v-model:open="crud.formOpen.value"
    v-model:form="crud.form.value"
    :mode="crud.formMode.value"
    :loading="crud.formSaving.value"
    @submit="crud.submitForm"
    @auto-slug="crud.autoSlug"
  />

  <ConfirmDialog
    v-model:open="crud.confirmOpen.value"
    variant="danger"
    title="Delete category?"
    :description="
      crud.deleting.value
        ? `“${crud.deleting.value.name}” contains ${crud.deleting.value.productsCount} products. Deleting is permanent.`
        : ''
    "
    :buttons="deleteButtons"
  />
</template>
