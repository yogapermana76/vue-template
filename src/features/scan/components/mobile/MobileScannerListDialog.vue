<script setup lang="ts">
  import { computed } from 'vue'
  import { CheckCircle2, RotateCcw } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { DialogWrapper } from '@/components/ui/dialog/composite'
  import TicketPreviewCard from '../TicketPreviewCard.vue'
  import type { ScanResult } from '@/types/services'
  import { isScanResultValid } from '../../utils/isScanResultValid'

  // Non-dismissible: operator must pick "Scan Ulang" or "Checkin" to leave state.
  const props = defineProps<{
    open: boolean
    scanResult: ScanResult | undefined
    selectedCodes: string[]
    isClaiming: boolean
  }>()

  const emit = defineEmits<{
    'update:selectedCodes': [codes: string[]]
    'scan-next': []
    'request-confirmation': []
  }>()

  const canConfirm = computed(() => isScanResultValid(props.scanResult))

  const checkinLabel = computed(() =>
    props.selectedCodes.length > 1 ? `Checkin ${props.selectedCodes.length}` : 'Checkin',
  )

  // v-model:open shim — no-op set; dismissal routed through footer buttons only.
  const dialogOpen = computed({
    get: () => props.open,
    set: () => {},
  })
</script>

<template>
  <DialogWrapper
    v-model:open="dialogOpen"
    size="full"
    title="Detail Tiket"
    :dismissible="false"
    :show-close-button="false"
    has-footer
  >
    <TicketPreviewCard
      v-if="scanResult"
      :selected-codes="selectedCodes"
      :scan-result="scanResult"
      @update:selected-codes="v => emit('update:selectedCodes', v)"
    />

    <template #footer>
      <div class="flex w-full gap-2">
        <Button
          variant="secondary"
          size="md"
          class="flex-1"
          :disabled="isClaiming"
          @click="emit('scan-next')"
        >
          <RotateCcw class="size-4" />
          Scan Ulang
        </Button>
        <Button
          v-if="canConfirm"
          variant="primary"
          size="md"
          class="flex-1"
          :loading="isClaiming"
          :disabled="selectedCodes.length === 0"
          @click="emit('request-confirmation')"
        >
          <CheckCircle2 class="size-4" />
          {{ checkinLabel }}
        </Button>
      </div>
    </template>
  </DialogWrapper>
</template>
