<script setup lang="ts">
  import { computed, watch } from 'vue'
  import type { PaginationOptions } from '@/components/ui/table'
  import { PageHeader } from '@/components/layout'
  import { DataTable } from '@/components/ui/table'
  import { usePrograms } from '@/composables/services'
  import { useSelectedProgram } from '@/composables/ui'
  import { PROGRAMS_PAGE_SIZE, ProgramSwitcher } from '@/features/dashboard'
  import {
    AmountCell,
    BuyerInfoCell,
    CategoryCell,
    ClaimStatusCell,
    createMonitoringColumns,
    DateCell,
    FullnameCell,
    MonitoringEmptyState,
    MonitoringFilterDialog,
    MonitoringToolbar,
    TicketDetailSheet,
    OrderNumberCell,
    TicketCodeCell,
    TypeCell,
    useMonitoringView,
  } from '@/features/monitoring'
  import type { MonitoringRow } from '@/features/monitoring'
  import { useScanModal } from '@/features/scan'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Monitoring Tiket' }],
    },
  })

  const { selectedProgramId, setSelectedProgramId } = useSelectedProgram()
  const programsQuery = usePrograms({ query: { page: 1, size: PROGRAMS_PAGE_SIZE } })
  const programs = computed(() => programsQuery.data.value?.data ?? [])
  watch(
    programs,
    list => {
      if (selectedProgramId.value === undefined && list.length > 0) {
        setSelectedProgramId(list[0].ID)
      }
    },
    { immediate: true },
  )

  // Sync selected program to the scan-modal singleton.
  const scanModal = useScanModal()
  watch(selectedProgramId, id => scanModal.setProgramId(id), { immediate: true })

  const view = useMonitoringView(() => selectedProgramId.value)
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
          <ProgramSwitcher
            :programs="programs"
            :model-value="selectedProgramId"
            :loading="programsQuery.isLoading.value"
            @update:model-value="(v: number | undefined) => setSelectedProgramId(v)"
          />
        </div>
      </template>
      <template #below>
        <div class="w-full sm:hidden">
          <ProgramSwitcher
            :programs="programs"
            :model-value="selectedProgramId"
            :loading="programsQuery.isLoading.value"
            @update:model-value="(v: number | undefined) => setSelectedProgramId(v)"
          />
        </div>
      </template>
    </PageHeader>

    <DataTable
      :data="view.rows.value"
      :columns="columns"
      :loading="view.isLoading.value"
      :pagination="paginationOptions"
      controlled-pagination
      row-key="TicketCode"
      bordered
      striped
      clickable-rows
      empty-message="Belum ada data monitoring untuk filter ini"
      @update:pagination="onPaginationUpdate"
      @row-click="row => view.openDetail(row as MonitoringRow)"
    >
      <template #toolbar>
        <MonitoringToolbar
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
        <MonitoringEmptyState :has-filter="view.hasAnyFilter.value" />
      </template>
    </DataTable>

    <MonitoringFilterDialog
      v-model:open="view.filterOpen.value"
      :state="view.filters.value"
      @apply="view.applyFilters"
    />

    <TicketDetailSheet
      v-model:open="view.detailOpen.value"
      :detail="view.detail.value"
      :loading="view.isDetailLoading.value"
      :program-id="selectedProgramId"
    />
  </div>
</template>
