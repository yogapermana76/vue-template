export * from './types'
export { useScan } from './composables/useScan'
export { useScanModal } from './composables/useScanModal'
export { useScanCameraLifecycle } from './composables/useScanCameraLifecycle'
export { default as ScanCamera } from './components/ScanCamera.vue'
export { default as ManualCodeInput } from './components/ManualCodeInput.vue'
export { default as TicketPreviewCard } from './components/TicketPreviewCard.vue'
export { default as MobileScannerView } from './components/MobileScannerView.vue'
export { default as ScanDialog } from './components/ScanDialog.vue'
export { default as ScanTriggerButton } from './components/ScanTriggerButton.vue'
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
