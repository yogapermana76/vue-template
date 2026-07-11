<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Check, Eye, X } from 'lucide-vue-next'
  import { PageHeader } from '@/components/layout'
  import { DataTable, TableActions, type TableAction } from '@/components/ui/table'
  import { EmptyState } from '@/components/ui/empty-state'
  import QuestioningMascot from '@/assets/illustrations/questioning-mascot.png'
  import { formatDateInTZ } from '@/utils/date'
  import {
    ApproveSubmissionDialog,
    RejectSubmissionDialog,
    SubmissionQuotaSection,
    SubmissionToolbar,
    buildSubmissionColumns,
    useSubmissionList,
    type SubmissionRow,
  } from '@/features/voucher-submission'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Voucher Submission' }],
    },
  })

  const router = useRouter()
  const view = useSubmissionList()

  const showBulkActions = computed(() => view.activeStatus.value === 'pending')

  // Same signal drives the per-row action menu: only meaningful when >1 action exists.
  const columns = computed(() => buildSubmissionColumns(showBulkActions.value))

  const rejectOpen = ref(false)
  const approveOpen = ref(false)
  const pendingRow = ref<SubmissionRow | null>(null)
  const bulkMode = ref(false)

  const openApproveSingle = (row: SubmissionRow) => {
    pendingRow.value = row
    bulkMode.value = false
    approveOpen.value = true
  }
  const openRejectSingle = (row: SubmissionRow) => {
    pendingRow.value = row
    bulkMode.value = false
    rejectOpen.value = true
  }
  const openApproveBulk = () => {
    pendingRow.value = null
    bulkMode.value = true
    approveOpen.value = true
  }
  const openRejectBulk = () => {
    pendingRow.value = null
    bulkMode.value = true
    rejectOpen.value = true
  }

  const targetIds = () =>
    bulkMode.value ? [...view.selectedIds.value] : pendingRow.value ? [pendingRow.value.id] : []

  const confirmApprove = () => {
    view.approve(targetIds())
    approveOpen.value = false
  }

  const confirmReject = () => {
    view.reject(targetIds())
    rejectOpen.value = false
  }

  const goToDetail = (row: SubmissionRow) => {
    router.push(`/voucher-submission/${row.id}`)
  }

  const rejectCount = computed(() => (bulkMode.value ? view.selectedIds.value.length : 1))

  const rowActions = (row: SubmissionRow): TableAction[] => [
    {
      key: 'view',
      label: 'Lihat Detail',
      icon: Eye,
      onClick: () => goToDetail(row),
    },
    {
      key: 'approve',
      label: 'Setujui',
      icon: Check,
      onClick: () => openApproveSingle(row),
    },
    {
      key: 'reject',
      label: 'Tolak',
      icon: X,
      variant: 'destructive',
      separator: true,
      onClick: () => openRejectSingle(row),
    },
  ]
</script>

<template>
  <div class="mx-auto flex w-full max-w-360 flex-col gap-5">
    <PageHeader title="Pengajuan" class="mb-0!" />

    <SubmissionQuotaSection :groups="view.quotaGroups.value" />

    <DataTable
      :data="view.filteredRows.value"
      :columns="columns"
      :selectable="showBulkActions"
      :selected-rows="view.selectedIds.value"
      row-key="id"
      bordered
      clickable-rows
      @update:selected-rows="v => (view.selectedIds.value = v.map(String))"
      @row-click="(row: SubmissionRow) => goToDetail(row)"
    >
      <template #empty>
        <EmptyState
          :image="QuestioningMascot"
          title="Belum ada pengajuan"
          description="Tidak ada pengajuan pada tab ini. Coba ubah filter atau periksa tab lain."
          class="min-h-60 py-8"
        />
      </template>

      <template #toolbar>
        <SubmissionToolbar
          :active-status="view.activeStatus.value"
          :status-order="view.statusOrder"
          :status-counts="view.statusCounts.value"
          :keyword="view.filters.keyword"
          :category="view.filters.category"
          :company="view.filters.company"
          :show-bulk-actions="showBulkActions"
          :bulk-disabled="view.selectedIds.value.length === 0"
          @update:active-status="view.setStatus"
          @update:keyword="view.setKeyword"
          @update:category="view.setCategory"
          @update:company="view.setCompany"
          @approve-selected="openApproveBulk"
          @reject-selected="openRejectBulk"
        />
      </template>

      <template #cell-submittedAt="{ value }">
        <span class="body-m text-neutral-700 tabular-nums">
          {{ formatDateInTZ(String(value), 'dd-MM-yyyy HH:mm') }}
        </span>
      </template>

      <template #cell-totalVouchers="{ value }">
        <span class="body-m-medium text-neutral-950 tabular-nums">{{ value }} Voucher</span>
      </template>

      <template #cell-actions="{ row }">
        <TableActions :actions="rowActions(row as SubmissionRow)" @click.stop />
      </template>
    </DataTable>

    <ApproveSubmissionDialog v-model:open="approveOpen" @confirm="confirmApprove" />

    <RejectSubmissionDialog
      v-model:open="rejectOpen"
      :count="rejectCount"
      @confirm="confirmReject"
    />
  </div>
</template>
