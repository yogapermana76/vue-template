<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useMediaQuery } from '@vueuse/core'
  import { CheckCircle2 } from 'lucide-vue-next'
  import { DialogWrapper } from '@/components/ui/dialog/composite'
  import { Button } from '@/components/ui/button'
  import { usePrograms } from '@/composables/services'
  import { PROGRAMS_PAGE_SIZE } from '@/features/dashboard'
  import { useScan } from '../composables/useScan'
  import { useGunScannerListener } from '../composables/useGunScannerListener'
  import { useScanModal } from '../composables/useScanModal'
  import { useScanCameraLifecycle } from '../composables/useScanCameraLifecycle'
  import ScanCamera from './ScanCamera.vue'
  import ManualCodeInput from './ManualCodeInput.vue'
  import TicketPreviewCard from './TicketPreviewCard.vue'
  import MobileScannerView from './MobileScannerView.vue'
  import ScanOutcomeDialog from './ScanOutcomeDialog.vue'
  import ScanProgramEmptyState from './desktop/ScanProgramEmptyState.vue'
  import ScanProgramHeader from './desktop/ScanProgramHeader.vue'
  import ScannerModeToggle, { type ScannerMode } from './desktop/ScannerModeToggle.vue'
  import ScannerGunPlaceholder from './desktop/ScannerGunPlaceholder.vue'
  import ScannerVerifyingCard from './desktop/ScannerVerifyingCard.vue'

  const props = defineProps<{
    open: boolean
    programId?: number
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const isMobile = useMediaQuery('(max-width: 1023px)')

  // Fetch programs lazily — only start once the dialog opens.
  const isDialogOpen = computed(() => props.open)
  const programsQuery = usePrograms({
    query: { page: 1, size: PROGRAMS_PAGE_SIZE },
    options: { enabled: isDialogOpen },
  })
  const programs = computed(() => programsQuery.data.value?.data ?? [])

  const scanModal = useScanModal()
  const onSelectProgram = (id: number | undefined) => scanModal.setProgramId(id)

  const scan = useScan(() => props.programId)

  const selectedCodes = ref<string[]>([])
  watch(
    () => scan.outcome.value?.code,
    () => {
      selectedCodes.value = []
    },
  )

  const scannerMode = ref<ScannerMode>('camera')
  const hasProgram = computed(() => !!props.programId)

  const gunEnabled = computed(
    () =>
      props.open &&
      !isMobile.value &&
      scannerMode.value === 'gun' &&
      hasProgram.value &&
      (scan.state.value === 'idle' || scan.state.value === 'scanning'),
  )
  useGunScannerListener(gunEnabled, code => scan.handleDetect(code))

  useScanCameraLifecycle({
    open: computed(() => props.open),
    isMobile,
    scannerMode,
    scan,
  })

  const setMode = (mode: ScannerMode) => {
    if (scannerMode.value === mode) return
    scannerMode.value = mode
    scan.reset()
  }

  const isScanningPhase = computed(
    () => scan.state.value === 'idle' || scan.state.value === 'scanning',
  )
  const showList = computed(() => scan.state.value === 'list')
  const showVerifying = computed(() => scan.state.value === 'verifying')

  const outcomeDialogRef = ref<InstanceType<typeof ScanOutcomeDialog> | null>(null)
  const outcomeKind = computed(() => outcomeDialogRef.value?.kind ?? null)

  // Hidden while an outcome dialog is up; only dismiss when no outcome is showing.
  const mainOpen = computed({
    get: () => openModel.value && outcomeKind.value === null,
    set: v => {
      if (!v && outcomeKind.value === null) openModel.value = false
    },
  })

  const listValidForClaim = computed(() => scan.canConfirmClaim.value)
</script>

<template>
  <MobileScannerView
    v-if="isMobile"
    v-model:selected-codes="selectedCodes"
    :open="open"
    :state="scan.state.value"
    :outcome="scan.outcome.value"
    :program-id="programId"
    :is-claiming="scan.isClaiming.value"
    :programs="programs"
    :programs-loading="programsQuery.isLoading.value"
    @update:open="v => (openModel = v)"
    @update:program-id="onSelectProgram"
    @detect="scan.handleDetect"
    @submit-manual="scan.submitManual"
    @request-confirmation="scan.requestConfirmation"
    @scan-next="scan.scanNext"
    @close="openModel = false"
  />

  <DialogWrapper
    v-else
    v-model:open="mainOpen"
    size="2xl"
    title="Scan Tiket"
    :show-close-button="true"
    :close-on-overlay-click="false"
    body-class="px-5 pb-5 pt-4"
    header-class="px-5"
  >
    <ScanProgramEmptyState
      v-if="!hasProgram"
      :programs="programs"
      :model-value="programId"
      :loading="programsQuery.isLoading.value"
      @update:model-value="onSelectProgram"
    />

    <div v-else class="flex flex-col gap-4">
      <ScanProgramHeader
        :programs="programs"
        :model-value="programId"
        :loading="programsQuery.isLoading.value"
        @update:model-value="onSelectProgram"
      />

      <ScannerModeToggle
        v-if="isScanningPhase"
        :model-value="scannerMode"
        @update:model-value="setMode"
      />

      <template v-if="scannerMode === 'camera' && isScanningPhase">
        <ScanCamera
          :active="scan.cameraActive.value"
          @start="scan.startCamera"
          @stop="scan.stopCamera"
          @detect="scan.handleDetect"
          @manual="setMode('gun')"
        />
        <ManualCodeInput @submit="scan.submitManual" />
      </template>

      <ScannerGunPlaceholder
        v-else-if="scannerMode === 'gun' && isScanningPhase"
        @submit="scan.submitManual"
      />

      <ScannerVerifyingCard v-else-if="showVerifying" />

      <TicketPreviewCard
        v-else-if="showList && scan.outcome.value?.scanResult"
        v-model:selected-codes="selectedCodes"
        :scan-result="scan.outcome.value.scanResult"
      />
    </div>

    <template v-if="hasProgram && showList" #footer>
      <div class="flex w-full flex-wrap items-center justify-end gap-2">
        <Button variant="secondary" size="md" @click="openModel = false"> Tutup </Button>
        <Button
          v-if="listValidForClaim"
          variant="primary"
          size="md"
          :disabled="selectedCodes.length === 0"
          @click="scan.requestConfirmation"
        >
          <CheckCircle2 class="size-4" />
          {{ selectedCodes.length > 1 ? `Checkin ${selectedCodes.length} Tiket` : 'Checkin' }}
        </Button>
      </div>
    </template>
  </DialogWrapper>

  <ScanOutcomeDialog
    ref="outcomeDialogRef"
    :state="scan.state.value"
    :outcome="scan.outcome.value"
    :outcome-message="scan.outcomeMessage.value"
    :is-claiming="scan.isClaiming.value"
    :selected-codes="selectedCodes"
    @confirm-claim="codes => scan.confirmClaim(codes)"
    @cancel-confirmation="scan.cancelConfirmation"
    @scan-next="scan.scanNext"
    @close="openModel = false"
  />
</template>
