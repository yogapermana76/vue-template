<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { PageHeader } from '@/components/layout'
  import {
    ApproveSubmissionDialog,
    RejectSubmissionDialog,
    ReleaseVoucherDialog,
    SubmissionIdentityCard,
    SubmissionQuantitiesCard,
    SubmissionVoucherTable,
    useSubmissionDetail,
  } from '@/features/voucher-submission'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Voucher Submission', to: '/voucher-submission' },
        { label: 'Detail' },
      ],
    },
  })

  const route = useRoute('/(loket)/voucher-submission/[id]')
  const router = useRouter()
  const id = computed(() => route.params.id ?? '')

  const { detail, isLoading, approveWithQuantities, reject, releaseVoucher } = useSubmissionDetail(
    () => id.value,
  )

  const isPending = computed(() => detail.value?.status === 'pending')

  const approvedInputs = ref<Record<string, number>>({})

  const approveOpen = ref(false)
  const rejectOpen = ref(false)
  const releaseOpen = ref(false)
  const releaseCode = ref<string | null>(null)

  const confirmApprove = () => {
    approveWithQuantities(approvedInputs.value)
    approvedInputs.value = {}
    approveOpen.value = false
  }
  const confirmReject = () => {
    reject()
    rejectOpen.value = false
  }
  const confirmRelease = () => {
    if (releaseCode.value) releaseVoucher(releaseCode.value)
    releaseCode.value = null
    releaseOpen.value = false
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

    <div v-if="isLoading" class="rounded-lg border border-neutral-200 bg-white p-8 text-center">
      <p class="body-m text-neutral-500">Memuat detail...</p>
    </div>

    <template v-else-if="detail">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
      @confirm="confirmApprove"
    />
    <RejectSubmissionDialog v-model:open="rejectOpen" @confirm="confirmReject" />
    <ReleaseVoucherDialog v-model:open="releaseOpen" @confirm="confirmRelease" />
  </div>
</template>
