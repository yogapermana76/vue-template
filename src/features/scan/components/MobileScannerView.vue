<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { QrcodeStream } from 'vue-qrcode-reader'
  import {
    MobileScannerCameraError,
    MobileScannerCameraLoading,
    MobileScannerEmptyProgram,
    MobileScannerHeader,
    MobileScannerListDialog,
    MobileScannerManualSheet,
    MobileScannerVerifyingOverlay,
    MobileScannerViewfinder,
  } from './mobile'
  import type { Program } from '@/types/services'
  import { useCameraLifecycle } from '../composables/useCameraLifecycle'
  import type { ScanOutcome, ScanState } from '../types'

  const props = defineProps<{
    open: boolean
    state: ScanState
    outcome: ScanOutcome | null
    programId: number | undefined
    isClaiming: boolean
    selectedCodes?: string[]
    programs?: Program[]
    programsLoading?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    'update:selectedCodes': [codes: string[]]
    'update:programId': [id: number | undefined]
    detect: [code: string]
    'submit-manual': [code: string]
    'request-confirmation': []
    'scan-next': []
    close: []
  }>()

  const hasProgram = computed(() => !!props.programId)

  const { cameraReady, cameraError, handleReady, handleError, resetReady } = useCameraLifecycle()

  const onDetect = (codes: { rawValue: string }[]) => {
    if (codes.length > 0) emit('detect', codes[0].rawValue)
  }

  const manualOpen = ref(false)

  // Reset ready flag when the sheet opens so the loader shows again on close.
  watch(manualOpen, isOpen => {
    if (isOpen) resetReady()
  })

  // Camera is live only while scanning; v-if tears down the stream in other states.
  const cameraOn = computed(
    () => props.state === 'scanning' && !manualOpen.value && !cameraError.value,
  )

  watch(cameraOn, on => {
    if (!on) resetReady()
  })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col bg-neutral-950"
      role="dialog"
      aria-modal="true"
      aria-label="Scan tiket"
    >
      <MobileScannerHeader
        :has-program="hasProgram"
        :programs="programs"
        :program-id="programId"
        :programs-loading="programsLoading"
        @close="emit('update:open', false)"
        @open-manual="manualOpen = true"
        @update:program-id="v => emit('update:programId', v)"
      />

      <MobileScannerEmptyProgram
        v-if="!hasProgram"
        :programs="programs"
        :loading="programsLoading"
        @update:program-id="v => emit('update:programId', v)"
      />

      <QrcodeStream
        v-else-if="cameraOn"
        class="absolute inset-0 h-full w-full"
        @detect="onDetect"
        @camera-on="handleReady"
        @error="handleError"
      />

      <MobileScannerViewfinder v-if="cameraReady && cameraOn" />

      <MobileScannerCameraLoading v-if="cameraOn && !cameraReady && !cameraError" />

      <MobileScannerCameraError
        v-if="cameraError"
        :message="cameraError"
        @open-manual="manualOpen = true"
      />

      <MobileScannerVerifyingOverlay v-if="state === 'verifying'" :code="outcome?.code" />

      <MobileScannerListDialog
        :open="state === 'list'"
        :scan-result="outcome?.scanResult"
        :selected-codes="selectedCodes ?? []"
        :is-claiming="isClaiming"
        @update:selected-codes="v => emit('update:selectedCodes', v)"
        @scan-next="emit('scan-next')"
        @request-confirmation="emit('request-confirmation')"
      />

      <MobileScannerManualSheet
        v-model:open="manualOpen"
        @submit="code => emit('submit-manual', code)"
      />
    </div>
  </Teleport>
</template>
