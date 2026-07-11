<script setup lang="ts">
  import { computed } from 'vue'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import QuestioningMascot from '@/assets/illustrations/questioning-mascot.png'

  const props = defineProps<{
    open: boolean
    count?: number
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

  const description = computed(() =>
    (props.count ?? 1) > 1
      ? 'Apakah Anda yakin ingin menolak semua pengajuan terpilih?'
      : 'Apakah Anda yakin ingin menolak pengajuan?',
  )

  const buttons = computed(() => [
    {
      label: 'Cek Kembali',
      variant: 'secondary' as const,
      disabled: props.submitting,
      onClick: () => (openModel.value = false),
    },
    {
      label: 'Ya, Tolak',
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
    title="Tolak Pengajuan?"
    :description="description"
    :buttons="buttons"
    :dismissible="!submitting"
    :hide-close="true"
  />
</template>
