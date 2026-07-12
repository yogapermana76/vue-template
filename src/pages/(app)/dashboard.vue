<script setup lang="ts">
  import { watch } from 'vue'
  import { PageHeader } from '@/components/layout'
  import { SectionHeader } from '@/components/shared'
  import {
    useDashboard,
    ProgramSwitcher,
    DashboardFilters,
    DashboardErrorBanner,
    StatsGrid,
    DashboardHero,
    SchedulesList,
  } from '@/features/dashboard'
  import { useScanModal } from '@/features/scan'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Dashboard Loket' }],
    },
  })

  const view = useDashboard()

  // Sync selected program to the scan-modal singleton (scan button uses it).
  const scanModal = useScanModal()
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
          <ProgramSwitcher
            :programs="view.programs.value"
            :model-value="view.selectedProgramId.value"
            :loading="view.isProgramsLoading.value"
            @update:model-value="view.selectProgram"
          />
        </div>
      </template>
      <template #below>
        <div class="w-full sm:hidden">
          <ProgramSwitcher
            :programs="view.programs.value"
            :model-value="view.selectedProgramId.value"
            :loading="view.isProgramsLoading.value"
            @update:model-value="view.selectProgram"
          />
        </div>
      </template>
    </PageHeader>

    <DashboardErrorBanner
      v-if="view.rootErrorMessage.value"
      :message="view.rootErrorMessage.value"
      @retry="view.refetchAll"
    />

    <DashboardHero
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
      <DashboardFilters
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
      <StatsGrid :statistics="view.statistics.value" :loading="view.isStatisticsLoading.value" />
    </section>

    <SchedulesList :schedules="view.schedules.value" :loading="view.isSchedulesLoading.value" />
  </div>
</template>
