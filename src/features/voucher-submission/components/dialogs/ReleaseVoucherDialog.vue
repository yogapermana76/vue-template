<script setup lang="ts">
  import { computed } from 'vue'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import QuestioningMascot from '@/assets/illustrations/questioning-mascot.png'

  const props = defineProps<{
    open: boolean
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
      label: 'Ya, Release',
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
    title="Release Kode Voucher?"
    description="Apakah Anda yakin ingin merelease kode voucher tersebut? Merelease kode voucher akan mengakibatkan user tidak dapat bertransaksi dan kuota akan ditambahkan sesuai dengan kategori."
    :buttons="buttons"
    :dismissible="!submitting"
    :hide-close="true"
  />
</template>
