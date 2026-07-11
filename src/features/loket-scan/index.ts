export * from './types'
export { useLoketScan } from './composables/useLoketScan'
export { useLoketScanModal } from './composables/useLoketScanModal'
export { useScanCameraLifecycle } from './composables/useScanCameraLifecycle'
export { default as LoketScanCamera } from './components/LoketScanCamera.vue'
export { default as LoketManualCodeInput } from './components/LoketManualCodeInput.vue'
export { default as LoketTicketPreviewCard } from './components/LoketTicketPreviewCard.vue'
export { default as LoketMobileScannerView } from './components/LoketMobileScannerView.vue'
export { default as LoketScanDialog } from './components/LoketScanDialog.vue'
export { default as LoketScanTriggerButton } from './components/LoketScanTriggerButton.vue'
export { default as ScanOutcomeDialog } from './components/ScanOutcomeDialog.vue'

// Desktop dialog sub-components
export { default as ScanProgramEmptyState } from './components/desktop/ScanProgramEmptyState.vue'
export { default as ScanProgramHeader } from './components/desktop/ScanProgramHeader.vue'
export {
  default as ScannerModeToggle,
  type ScannerMode,
} from './components/desktop/ScannerModeToggle.vue'
export { default as ScannerGunPlaceholder } from './components/desktop/ScannerGunPlaceholder.vue'
export { default as ScannerVerifyingCard } from './components/desktop/ScannerVerifyingCard.vue'
