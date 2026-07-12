import { ref } from 'vue'

export function useCameraLifecycle() {
  const cameraReady = ref(false)
  const cameraError = ref<string | null>(null)

  const ERROR_COPY: Record<string, string> = {
    NotAllowedError: 'Izin kamera ditolak.',
    NotFoundError: 'Kamera tidak ditemukan.',
    NotReadableError: 'Kamera sedang dipakai.',
    NotSupportedError: 'Butuh HTTPS untuk mengakses kamera.',
  }

  const handleReady = () => {
    cameraReady.value = true
    cameraError.value = null
  }

  const handleError = (err: Error) => {
    cameraReady.value = false
    cameraError.value = ERROR_COPY[err.name] ?? 'Kamera gagal dibuka.'
  }

  const resetReady = () => {
    cameraReady.value = false
  }

  return {
    cameraReady,
    cameraError,
    handleReady,
    handleError,
    resetReady,
  }
}
