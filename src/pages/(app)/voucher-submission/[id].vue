<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useQueryClient } from '@tanstack/vue-query'
  import { PageHeader } from '@/components/layout'
  import {
    invitationKeys,
    useApproveInvitationSingle,
    useInvitationDetail,
    useReleaseVoucher,
  } from '@/composables/services'
  import {
    ApproveSubmissionDialog,
    RejectSubmissionDialog,
    ReleaseVoucherDialog,
    SubmissionDetailSkeleton,
    SubmissionIdentityCard,
    SubmissionQuantitiesCard,
    SubmissionVoucherTable,
    toSubmissionDetail,
  } from '@/features/voucher-submission'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Voucher Submission', to: '/voucher-submission' },
        { label: 'Detail' },
      ],
    },
  })

  const route = useRoute('/(app)/voucher-submission/[id]')
  const router = useRouter()
  const queryClient = useQueryClient()

  const invitationId = computed(() => {
    const n = Number(route.params.id)
    return Number.isFinite(n) && n > 0 ? n : undefined
  })

  const detailQuery = useInvitationDetail({ params: { id: invitationId } })

  const detail = computed(() => {
    const data = detailQuery.data.value?.data
    return data ? toSubmissionDetail(data) : null
  })

  const isLoading = computed(() => detailQuery.isLoading.value)
  const isPending = computed(() => detail.value?.status === 'pending')

  const approvedInputs = ref<Record<number, number>>({})

  const approveOpen = ref(false)
  const rejectOpen = ref(false)
  const releaseOpen = ref(false)
  const releaseCode = ref<string | null>(null)

  // Single endpoint — carries per-ticket QuotaApproved. Handles both approve
  // (Approved=true) and reject (Approved=false, quotas ignored by backend).
  const approveSingle = useApproveInvitationSingle()
  const releaseMutation = useReleaseVoucher()

  const invalidateAfterMutation = () => {
    // Invalidate the whole invitation namespace so summary/count/list also refresh,
    // and force an immediate refetch of the currently-visible detail query.
    queryClient.invalidateQueries({ queryKey: invitationKeys.all })
    if (invitationId.value !== undefined) {
      void queryClient.refetchQueries({ queryKey: invitationKeys.detail(invitationId.value) })
    }
  }

  const runDecision = (approved: boolean, onDone: () => void) => {
    if (!invitationId.value || !detail.value) return
    // Backend expects one entry per ticket. On reject the values don't matter,
    // but the array shape does — send zero so the payload stays consistent.
    const tickets = detail.value.quantities.map(q => ({
      TicketId: q.ticketId,
      QuotaApproved: approved ? (approvedInputs.value[q.ticketId] ?? 0) : 0,
    }))
    approveSingle.mutate(
      { InvitationID: invitationId.value, Approved: approved, Tickets: tickets },
      {
        onSuccess: () => {
          onDone()
          approvedInputs.value = {}
          invalidateAfterMutation()
        },
      },
    )
  }

  const confirmApprove = () => runDecision(true, () => (approveOpen.value = false))
  const confirmReject = () => runDecision(false, () => (rejectOpen.value = false))

  const confirmRelease = () => {
    const code = releaseCode.value
    if (!code || !detail.value) return
    const voucher = detail.value.vouchers.find(v => v.code === code)
    if (!voucher) return
    releaseMutation.mutate(
      { VoucherIds: [voucher.voucherId] },
      {
        onSuccess: () => {
          releaseCode.value = null
          releaseOpen.value = false
          invalidateAfterMutation()
        },
      },
    )
  }

  const openRelease = (code: string) => {
    releaseCode.value = code
    releaseOpen.value = true
  }

  const goBack = () => router.push('/voucher-submission')
</script>

<template>
  <div class="mx-auto flex w-full max-w-360 flex-col gap-5">
    <PageHeader title="Detail" back back-label="Kembali" class="mb-0!" @back="goBack" />

    <SubmissionDetailSkeleton v-if="isLoading" />

    <template v-else-if="detail">
      <div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <SubmissionIdentityCard :detail="detail" />
        <SubmissionQuantitiesCard
          :quantities="detail.quantities"
          :mode="isPending ? 'edit' : 'view'"
          :approved-inputs="approvedInputs"
          @update:approved-inputs="v => (approvedInputs = v)"
          @approve="approveOpen = true"
          @reject="rejectOpen = true"
        />
      </div>

      <SubmissionVoucherTable
        v-if="detail.vouchers.length"
        :vouchers="detail.vouchers"
        @release="openRelease"
      />
    </template>

    <div v-else class="rounded-lg border border-neutral-200 bg-white p-8 text-center">
      <p class="body-m text-neutral-500">Detail tidak ditemukan.</p>
    </div>

    <ApproveSubmissionDialog
      v-model:open="approveOpen"
      :quantities="detail?.quantities"
      :approved-inputs="approvedInputs"
      :submitting="approveSingle.isPending.value"
      @confirm="confirmApprove"
    />
    <RejectSubmissionDialog
      v-model:open="rejectOpen"
      :submitting="approveSingle.isPending.value"
      @confirm="confirmReject"
    />
    <ReleaseVoucherDialog
      v-model:open="releaseOpen"
      :submitting="releaseMutation.isPending.value"
      @confirm="confirmRelease"
    />
  </div>
</template>
