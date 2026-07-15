<script setup lang="ts">
  import { computed } from 'vue'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import QuestioningMascot from '@/assets/illustrations/questioning-mascot.png'
  import type { SubmissionQuantityDetail } from '../../types'
  import SubmissionApprovalPreview from './SubmissionApprovalPreview.vue'

  const props = defineProps<{
    open: boolean
    quantities?: SubmissionQuantityDetail[]
    approvedInputs?: Record<number, number>
    submitting?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    confirm: []
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const buttons = computed(() => [
    {
      label: 'Cek Kembali',
      variant: 'secondary' as const,
      disabled: props.submitting,
      onClick: () => (openModel.value = false),
    },
    {
      label: 'Ya, Setuju',
      variant: 'primary' as const,
      loading: props.submitting,
      onClick: () => emit('confirm'),
    },
  ])
</script>

<template>
  <ConfirmDialog
    v-model:open="openModel"
    :image="QuestioningMascot"
    title="Setujui Pengajuan?"
    description="Apakah Anda yakin ingin menyetujui pengajuan tersebut ?"
    :buttons="buttons"
    :dismissible="!submitting"
    :hide-close="true"
  >
    <SubmissionApprovalPreview
      :quantities="quantities ?? []"
      :approved-inputs="approvedInputs"
      :disabled="submitting"
    />
  </ConfirmDialog>
</template>
