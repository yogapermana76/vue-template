<script setup lang="ts">
  import { computed } from 'vue'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import QuestioningMascot from '@/assets/illustrations/questioning-mascot.png'
  import type { SubmissionQuantityDetail } from '../../types'

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

  const previewBuckets = computed(() =>
    (props.quantities ?? []).map(q => ({
      id: q.ticketId,
      label: q.type,
      value: props.approvedInputs?.[q.ticketId] ?? q.approved ?? 0,
    })),
  )
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
    <div
      v-if="previewBuckets.length"
      class="grid gap-2 pt-1"
      :class="previewBuckets.length > 3 ? 'grid-cols-2' : 'grid-cols-3'"
    >
      <div
        v-for="b in previewBuckets"
        :key="b.id"
        class="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2"
      >
        <span class="body-m-semibold text-neutral-900">{{ b.label }}</span>
        <span class="body-m-medium text-neutral-700 tabular-nums">{{ b.value }}</span>
      </div>
    </div>
  </ConfirmDialog>
</template>
