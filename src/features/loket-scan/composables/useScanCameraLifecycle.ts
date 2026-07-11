import { watch, type Ref } from 'vue'
import type { ScanState } from '../types'

type ScannerMode = 'camera' | 'gun'

interface ScanApi {
  state: Ref<ScanState>
  startCamera: () => void
  stopCamera: () => void
  reset: () => void
}

interface Options {
  open: Ref<boolean>
  isMobile: Ref<boolean>
  scannerMode: Ref<ScannerMode>
  scan: ScanApi
  onClose?: () => void
}

export function useScanCameraLifecycle({ open, isMobile, scannerMode, scan, onClose }: Options) {
  watch([scannerMode, open, isMobile], ([mode, isOpen, mobile]) => {
    if (isOpen && !mobile && mode === 'camera' && scan.state.value === 'idle') {
      scan.startCamera()
    }
    if (mode === 'gun') scan.stopCamera()
  })

  watch([open, isMobile], ([isOpen, mobile]) => {
    if (isOpen && mobile && scan.state.value === 'idle') {
      scan.startCamera()
    }
  })

  watch(open, isOpen => {
    if (!isOpen) {
      scan.reset()
      scannerMode.value = 'camera'
      onClose?.()
    }
  })
}
