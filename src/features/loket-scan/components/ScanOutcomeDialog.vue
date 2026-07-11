<script setup lang="ts">
  import { computed } from 'vue'
  import {
    ConfirmDialog,
    type ConfirmDialogButton,
    type ConfirmDialogVariant,
  } from '@/components/ui/dialog/composite'
  import SuccessMascot from '@/assets/illustrations/success-mascot.png'
  import type { ScanOutcome, ScanState } from '../types'

  const props = defineProps<{
    state: ScanState
    outcome: ScanOutcome | null
    outcomeMessage: string | null
    isClaiming: boolean
    /** Codes the operator selected for a bulk claim. */
    selectedCodes: string[]
  }>()

  const emit = defineEmits<{
    'confirm-claim': [codes: string[]]
    'cancel-confirmation': []
    'scan-next': []
    close: []
  }>()

  type OutcomeKind = 'confirmation' | 'success' | 'error' | null

  const kind = computed<OutcomeKind>(() => {
    const s = props.state
    if (s === 'confirming' || s === 'claiming') return 'confirmation'
    if (s === 'success') return 'success'
    if (s === 'error') return 'error'
    return null
  })

  interface OutcomeContent {
    variant: ConfirmDialogVariant
    image?: string
    title: string
    description?: string
    buttons: ConfirmDialogButton[]
  }

  const content = computed<OutcomeContent | null>(() => {
    switch (kind.value) {
      case 'confirmation':
        return {
          variant: 'primary',
          title: 'Konfirmasi Checkin',
          description: 'Apakah anda yakin akan melakukan Checkin?',
          buttons: [
            // Column layout renders first button on top — primary action first.
            {
              label: 'Checkin',
              variant: 'primary',
              loading: props.isClaiming,
              onClick: () => emit('confirm-claim', props.selectedCodes),
            },
            {
              label: 'Cek Kembali',
              variant: 'secondary',
              disabled: props.isClaiming,
              onClick: () => emit('cancel-confirmation'),
            },
          ],
        }

      case 'success': {
        // Only surface failed codes on partial success.
        const failed = props.outcome?.failedCodes ?? []
        const description = failed.length ? `Tiket yang gagal: ${failed.join(', ')}` : undefined
        return {
          variant: 'success',
          image: SuccessMascot,
          title: props.outcomeMessage ?? 'Berhasil klaim tiket',
          description,
          buttons: [
            { label: 'Scan Tiket Lainnya', variant: 'primary', onClick: () => emit('scan-next') },
            { label: 'Kembali', variant: 'secondary', onClick: () => emit('close') },
          ],
        }
      }

      case 'error': {
        // 404 → warning; other errors → danger.
        const status = props.outcome?.statusCode
        const variant: ConfirmDialogVariant = status === 404 ? 'warning' : 'danger'
        const failed = props.outcome?.failedCodes ?? []
        const description = failed.length ? `Tiket gagal: ${failed.join(', ')}` : undefined
        return {
          variant,
          title: props.outcomeMessage ?? 'Terjadi kesalahan',
          description,
          buttons: [
            { label: 'Scan Ulang', variant: 'primary', onClick: () => emit('scan-next') },
            { label: 'Tutup', variant: 'secondary', onClick: () => emit('close') },
          ],
        }
      }

      default:
        return null
    }
  })

  // Closing routes through per-kind handlers so the state machine transitions correctly.
  const openModel = computed({
    get: () => kind.value !== null,
    set: v => {
      if (v) return
      if (kind.value === 'confirmation') emit('cancel-confirmation')
      else if (kind.value === 'success' || kind.value === 'error') emit('close')
    },
  })

  defineExpose({ kind })
</script>

<template>
  <!-- Column button layout puts primary on top (thumb reach). -->
  <ConfirmDialog
    v-if="content"
    v-model:open="openModel"
    :variant="content.variant"
    :image="content.image"
    :title="content.title"
    :description="content.description"
    :buttons="content.buttons"
    button-layout="column"
    :dismissible="kind === 'confirmation'"
    :hide-close="kind !== 'confirmation'"
  />
</template>
