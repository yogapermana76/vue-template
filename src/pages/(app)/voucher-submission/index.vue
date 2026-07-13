<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useQueryClient } from '@tanstack/vue-query'
  import { Check, Eye, X } from 'lucide-vue-next'
  import { PageHeader } from '@/components/layout'
  import {
    DataTable,
    TableActions,
    type PaginationOptions,
    type TableAction,
  } from '@/components/ui/table'
  import { EmptyState } from '@/components/ui/empty-state'
  import QuestioningMascot from '@/assets/illustrations/questioning-mascot.png'
  import { formatDateInTZ } from '@/utils/date'
  import {
    invitationKeys,
    useApproveInvitation,
    usePrograms,
    useInvitationCount,
    useInvitationList,
    useInvitationProgramInfo,
    useInvitationSummary,
  } from '@/composables/services'
  import { useToast } from '@/composables/ui'
  import { PROGRAMS_PAGE_SIZE, ProgramSwitcher } from '@/features/dashboard'
  import {
    ApproveSubmissionDialog,
    RejectSubmissionDialog,
    SubmissionQuotaSection,
    SubmissionToolbar,
    buildSubmissionColumns,
    toBackendStatus,
    toQuotaGroups,
    toStatusCounts,
    toSubmissionRow,
    useSubmissionList,
    type SubmissionRow,
  } from '@/features/voucher-submission'

  definePage({
    meta: {
      breadcrumbs: [{ label: 'Voucher Submission' }],
    },
  })

  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()
  const view = useSubmissionList()

  // ============================================
  // Program switcher
  // ============================================

  const selectedProgramId = ref<number | undefined>()
  const programsQuery = usePrograms({ query: { page: 1, size: PROGRAMS_PAGE_SIZE } })
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

  // ============================================
  // Category options — sourced from program info (mirrors voucher-request).
  // ============================================

  const programInfo = useInvitationProgramInfo({ params: { programId: selectedProgramId } })

  const categoryOptions = computed(() =>
    (programInfo.data.value?.data?.Categories ?? []).map(c => ({
      value: String(c.CategoryID),
      label: c.CategoryName,
    })),
  )

  const selectedCategoryId = computed(() => {
    const raw = view.filters.category
    const parsed = raw ? Number(raw) : NaN
    return Number.isFinite(parsed) ? parsed : undefined
  })

  const backendStatus = computed(() => toBackendStatus(view.activeStatus.value))
  const keywordParam = computed(() => view.filters.keyword || undefined)

  // ============================================
  // Pagination state
  // ============================================

  const page = ref(1)
  const pageSize = ref(10)

  // Reset to page 1 when any filter (status, category, keyword) changes.
  watch([backendStatus, selectedCategoryId, keywordParam], () => (page.value = 1))

  // ============================================
  // Invitation API calls
  // ============================================

  const invitationSummary = useInvitationSummary({ params: { programId: selectedProgramId } })

  const invitationCount = useInvitationCount({
    params: { programId: selectedProgramId },
    query: { categoryId: selectedCategoryId, keyword: keywordParam, status: backendStatus },
  })

  const invitationList = useInvitationList({
    params: { programId: selectedProgramId },
    query: {
      page,
      size: pageSize,
      categoryId: selectedCategoryId,
      keyword: keywordParam,
      status: backendStatus,
    },
  })

  // ============================================
  // Backend → UI adapters (see features/voucher-submission/adapters.ts)
  // ============================================

  const quotaGroups = computed(() => toQuotaGroups(invitationSummary.data.value?.data ?? []))
  const statusCounts = computed(() => toStatusCounts(invitationCount.data.value?.data))
  const rows = computed(() =>
    (invitationList.data.value?.data ?? []).map(r => toSubmissionRow(r, view.activeStatus.value)),
  )

  const paginationOptions = computed<PaginationOptions>(() => ({
    page: page.value,
    pageSize: pageSize.value,
    total: invitationList.data.value?.pagination?.Total ?? 0,
    pageSizeOptions: [10, 25, 50, 100],
  }))

  const onPaginationUpdate = (next: PaginationOptions) => {
    if (next.page !== page.value) page.value = next.page
    if (next.pageSize !== pageSize.value) {
      pageSize.value = next.pageSize
      page.value = 1
    }
  }

  const showBulkActions = computed(() => view.activeStatus.value === 'pending')
  // Same signal drives the per-row action menu: only meaningful when >1 action exists.
  const columns = computed(() => buildSubmissionColumns(showBulkActions.value))

  // ============================================
  // Approve / reject action state
  // ============================================

  const approveOpen = ref(false)
  const rejectOpen = ref(false)
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

  /** Numeric backend IDs — approve/reject mutations require IDs, not RequestCodes. */
  const targetBackendIds = (): number[] => {
    if (bulkMode.value) {
      const idSet = new Set(view.selectedIds.value)
      return rows.value.filter(r => idSet.has(r.id)).map(r => r.backendId)
    }
    return pendingRow.value ? [pendingRow.value.backendId] : []
  }

  const approve = useApproveInvitation()

  const invalidateInvitationQueries = () => {
    queryClient.invalidateQueries({ queryKey: invitationKeys.all })
  }

  const confirmApprove = () => {
    const ids = targetBackendIds()
    if (ids.length === 0) return
    approve.mutate(
      { InvitationCodesIds: ids },
      {
        onSuccess: () => {
          approveOpen.value = false
          view.selectedIds.value = []
          invalidateInvitationQueries()
        },
      },
    )
  }

  // Reject endpoint TBD — for now log + close dialog. Backend hookup lands later.
  const confirmReject = () => {
    const ids = targetBackendIds()
    // eslint-disable-next-line no-console
    console.log('[TODO reject] backend IDs', ids)
    toast.info({
      title: 'Belum tersedia',
      description: 'Endpoint tolak masih menunggu backend. Tindakan tidak diproses.',
    })
    rejectOpen.value = false
  }

  const goToDetail = (row: SubmissionRow) => {
    router.push(`/voucher-submission/${row.id}`)
  }

  const rejectCount = computed(() => (bulkMode.value ? view.selectedIds.value.length : 1))

  const rowActions = (row: SubmissionRow): TableAction[] => [
    { key: 'view', label: 'Lihat Detail', icon: Eye, onClick: () => goToDetail(row) },
    { key: 'approve', label: 'Setujui', icon: Check, onClick: () => openApproveSingle(row) },
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
    <PageHeader
      title="Pengajuan"
      subtitle="Tinjau, setujui, atau tolak pengajuan voucher dari peserta."
      class="mb-0!"
    >
      <template #actions>
        <div class="hidden sm:block">
          <ProgramSwitcher
            :programs="programs"
            :model-value="selectedProgramId"
            :loading="programsQuery.isLoading.value"
            @update:model-value="(v: number | undefined) => (selectedProgramId = v)"
          />
        </div>
      </template>
      <template #below>
        <div class="w-full sm:hidden">
          <ProgramSwitcher
            :programs="programs"
            :model-value="selectedProgramId"
            :loading="programsQuery.isLoading.value"
            @update:model-value="(v: number | undefined) => (selectedProgramId = v)"
          />
        </div>
      </template>
    </PageHeader>

    <SubmissionQuotaSection :groups="quotaGroups" />

    <DataTable
      :data="rows"
      :columns="columns"
      :loading="invitationList.isLoading.value"
      :pagination="paginationOptions"
      :selectable="showBulkActions"
      :selected-rows="view.selectedIds.value"
      row-key="id"
      bordered
      clickable-rows
      @update:pagination="onPaginationUpdate"
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
          :status-counts="statusCounts"
          :keyword="view.filters.keyword"
          :category="view.filters.category"
          :category-options="categoryOptions"
          :show-bulk-actions="showBulkActions"
          :bulk-disabled="view.selectedIds.value.length === 0"
          @update:active-status="view.setStatus"
          @update:keyword="view.setKeyword"
          @update:category="view.setCategory"
          @approve-selected="openApproveBulk"
          @reject-selected="openRejectBulk"
        />
      </template>

      <template #cell-submittedAt="{ value }">
        <span class="body-m text-neutral-700 tabular-nums">
          {{ formatDateInTZ(String(value), 'd MMM yyyy HH:mm') }}
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
