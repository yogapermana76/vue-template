<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { PaginationOptions } from '@/components/ui/table'
  import { PageHeader } from '@/components/layout'
  import { DataTable } from '@/components/ui/table'
  import { useLoketPrograms } from '@/composables/services/loket'
  import { LOKET_PROGRAMS_PAGE_SIZE, LoketProgramSwitcher } from '@/features/loket-dashboard'
  import {
    AmountCell,
    BuyerInfoCell,
    CategoryCell,
    ClaimStatusCell,
    createMonitoringColumns,
    DateCell,
    FullnameCell,
    LoketMonitoringEmptyState,
    LoketMonitoringFilterDialog,
    LoketMonitoringToolbar,
    LoketTicketDetailSheet,
    OrderNumberCell,
    TicketCodeCell,
    TypeCell,
    useLoketMonitoringView,
  } from '@/features/loket-monitoring'
  import type { MonitoringRow } from '@/features/loket-monitoring'
  import { useLoketScanModal } from '@/features/loket-scan'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Monitoring Tiket' }],
    },
  })

  const selectedProgramId = ref<number | undefined>()
  const programsQuery = useLoketPrograms({ query: { page: 1, size: LOKET_PROGRAMS_PAGE_SIZE } })
  const programs = computed(() => programsQuery.data.value?.data ?? [])
  watch(
    programs,
    list => {
      if (selectedProgramId.value === undefined && list.length > 0) {
        selectedProgramId.value = list[0].ID
      }
    },
    { immediate: true },
  )

  // Sync selected program to the scan-modal singleton.
  const scanModal = useLoketScanModal()
  watch(selectedProgramId, id => scanModal.setProgramId(id), { immediate: true })

  const view = useLoketMonitoringView(() => selectedProgramId.value)
  const columns = computed(() => createMonitoringColumns(view.headers.value))

  const paginationOptions = computed<PaginationOptions>(() => ({
    page: view.page.value,
    pageSize: view.perPage.value,
    total: view.pagination.value?.Total ?? 0,
    pageSizeOptions: [10, 25, 50, 100],
  }))

  const onPaginationUpdate = (next: PaginationOptions) => {
    if (next.page !== view.page.value) view.goToPage(next.page)
    if (next.pageSize !== view.perPage.value) view.setPerPage(next.pageSize)
  }
</script>

<template>
  <div class="mx-auto flex w-full max-w-360 flex-col gap-5">
    <PageHeader
      title="Monitoring Tiket"
      subtitle="Pantau dan kelola tiket yang terjual."
      class="mb-0!"
    >
      <template #actions>
        <div class="hidden sm:block">
          <LoketProgramSwitcher
            :programs="programs"
            :model-value="selectedProgramId"
            :loading="programsQuery.isLoading.value"
            @update:model-value="(v: number | undefined) => (selectedProgramId = v)"
          />
        </div>
      </template>
      <template #below>
        <div class="w-full sm:hidden">
          <LoketProgramSwitcher
            :programs="programs"
            :model-value="selectedProgramId"
            :loading="programsQuery.isLoading.value"
            @update:model-value="(v: number | undefined) => (selectedProgramId = v)"
          />
        </div>
      </template>
    </PageHeader>

    <DataTable
      :data="view.rows.value"
      :columns="columns"
      :loading="view.isLoading.value"
      :pagination="paginationOptions"
      row-key="TicketCode"
      bordered
      striped
      clickable-rows
      empty-message="Belum ada data monitoring untuk filter ini"
      @update:pagination="onPaginationUpdate"
      @row-click="row => view.openDetail(row as MonitoringRow)"
    >
      <template #toolbar>
        <LoketMonitoringToolbar
          :keyword="view.filters.value.keyword"
          :claimed="view.filters.value.claimed"
          :exporting="view.isExporting.value"
          :active-filter-count="view.activeFilterCount.value"
          :disabled="!selectedProgramId"
          @update:keyword="view.setKeyword"
          @update:claimed="view.setClaimed"
          @open-filter="view.openFilter"
          @export="view.exportToExcel"
        />
      </template>

      <template #cell-TicketCode="{ value }">
        <TicketCodeCell :value="value" />
      </template>
      <template #cell-Fullname="{ value }">
        <FullnameCell :value="value" />
      </template>
      <template #cell-BuyerInfo="{ value }">
        <BuyerInfoCell :value="value" />
      </template>
      <template #cell-TicketCategory="{ value }">
        <CategoryCell :value="value" />
      </template>
      <template #cell-TicketType="{ value }">
        <TypeCell :value="value" />
      </template>
      <template #cell-OrderNumber="{ value }">
        <OrderNumberCell :value="value" />
      </template>
      <template #cell-Claimed="{ value }">
        <ClaimStatusCell :value="value" />
      </template>
      <template #cell-OrderDate="{ value, row }">
        <DateCell :value="value" :tz="(row as MonitoringRow).Timezone" />
      </template>
      <template #cell-ClaimedAt="{ value, row }">
        <DateCell :value="value" :tz="(row as MonitoringRow).Timezone" />
      </template>
      <template #cell-Amount="{ value }">
        <AmountCell :value="value" />
      </template>

      <template #empty>
        <LoketMonitoringEmptyState :has-filter="view.hasAnyFilter.value" />
      </template>
    </DataTable>

    <LoketMonitoringFilterDialog
      v-model:open="view.filterOpen.value"
      :state="view.filters.value"
      @apply="view.applyFilters"
    />

    <LoketTicketDetailSheet
      v-model:open="view.detailOpen.value"
      :detail="view.detail.value"
      :loading="view.isDetailLoading.value"
    />
  </div>
</template>
