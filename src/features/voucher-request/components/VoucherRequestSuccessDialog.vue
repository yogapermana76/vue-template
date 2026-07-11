<script setup lang="ts">
  import { computed } from 'vue'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import SuccessMascot from '@/assets/illustrations/success-mascot.png'
  import VoucherRequestSuccessCard from './VoucherRequestSuccessCard.vue'

  const props = defineProps<{
    open: boolean
    requestId: string
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    acknowledge: []
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const buttons = computed(() => [
    {
      label: 'Mengerti',
      variant: 'primary' as const,
      onClick: () => emit('acknowledge'),
    },
  ])
</script>

<template>
  <ConfirmDialog
    v-model:open="openModel"
    variant="success"
    :image="SuccessMascot"
    title="Pengajuan Pemesanan Berhasil"
    description="Anda telah berhasil melakukan pemesanan Voucher. Selanjutnya akan kami informasikan melalui email yang sudah Anda masukkan sebelumnya. Terimakasih"
    :buttons="buttons"
    button-layout="column"
    :dismissible="false"
    hide-close
  >
    <VoucherRequestSuccessCard :request-id="requestId" />
  </ConfirmDialog>
</template>
