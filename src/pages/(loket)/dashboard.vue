<script setup lang="ts">
  import { watch } from 'vue'
  import { PageHeader } from '@/components/layout'
  import { SectionHeader } from '@/components/shared'
  import {
    useLoketDashboard,
    LoketProgramSwitcher,
    LoketDashboardFilters,
    LoketDashboardErrorBanner,
    LoketStatsGrid,
    LoketDashboardHero,
    LoketSchedulesList,
  } from '@/features/loket-dashboard'
  import { useLoketScanModal } from '@/features/loket-scan'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Dashboard Loket' }],
    },
  })

  const view = useLoketDashboard()

  // Sync selected program to the scan-modal singleton (scan button uses it).
  const scanModal = useLoketScanModal()
  watch(
    () => view.selectedProgramId.value,
    id => scanModal.setProgramId(id),
    { immediate: true },
  )
</script>

<template>
  <div class="mx-auto flex w-full max-w-360 flex-col gap-5">
    <PageHeader
      title="Dashboard Loket"
      subtitle="Ringkasan penjualan tiket dan aktivitas program event."
      class="mb-0!"
    >
      <template #actions>
        <div class="hidden sm:block">
          <LoketProgramSwitcher
            :programs="view.programs.value"
            :model-value="view.selectedProgramId.value"
            :loading="view.isProgramsLoading.value"
            @update:model-value="view.selectProgram"
          />
        </div>
      </template>
      <template #below>
        <div class="w-full sm:hidden">
          <LoketProgramSwitcher
            :programs="view.programs.value"
            :model-value="view.selectedProgramId.value"
            :loading="view.isProgramsLoading.value"
            @update:model-value="view.selectProgram"
          />
        </div>
      </template>
    </PageHeader>

    <LoketDashboardErrorBanner
      v-if="view.rootErrorMessage.value"
      :message="view.rootErrorMessage.value"
      @retry="view.refetchAll"
    />

    <LoketDashboardHero
      :program="view.selectedProgram.value"
      :banners="view.banners.value"
      :loading="view.isProgramsLoading.value || view.isBannersLoading.value"
    />

    <!-- Filters scope the statistics below — keep them adjacent. -->
    <section class="flex flex-col gap-3">
      <SectionHeader
        title="Filter"
        subtitle="Persempit statistik dengan kategori & rentang tanggal"
      />
      <LoketDashboardFilters
        :categories="view.categories.value"
        :category-id="view.selectedCategoryId.value"
        :date-range="view.dateRange.value"
        :disabled="!view.selectedProgramId.value"
        @update:category-id="v => (view.selectedCategoryId.value = v)"
        @update:date-range="view.setDateRange"
        @reset="view.resetFilters"
      />
    </section>

    <section class="flex flex-col gap-3">
      <SectionHeader
        title="Ringkasan Statistik"
        subtitle="Angka utama untuk periode dan kategori terpilih"
      />
      <LoketStatsGrid
        :statistics="view.statistics.value"
        :loading="view.isStatisticsLoading.value"
      />
    </section>

    <LoketSchedulesList
      :schedules="view.schedules.value"
      :loading="view.isSchedulesLoading.value"
    />
  </div>
</template>
