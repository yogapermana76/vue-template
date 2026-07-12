<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { QrcodeStream } from 'vue-qrcode-reader'
  import { Camera, KeyRound, Loader2, ScanLine, VideoOff } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  const props = defineProps<{
    active: boolean
    disabled?: boolean
    hint?: string
  }>()

  const emit = defineEmits<{
    detect: [code: string]
    start: []
    stop: []
    error: [error: Error]
    manual: []
  }>()

  const isReady = ref(false)
  const errorMessage = ref<string | null>(null)

  const onDetect = (codes: { rawValue: string }[]) => {
    if (codes.length > 0) emit('detect', codes[0].rawValue)
  }

  const onCameraReady = () => {
    isReady.value = true
    errorMessage.value = null
  }

  const onCameraError = (err: Error) => {
    isReady.value = false
    const map: Record<string, string> = {
      NotAllowedError: 'Akses kamera ditolak. Berikan izin kamera pada browser Anda.',
      NotFoundError: 'Kamera tidak ditemukan pada perangkat ini.',
      NotReadableError: 'Kamera sedang dipakai oleh aplikasi lain.',
      NotSupportedError: 'Halaman harus diakses via HTTPS untuk mengaktifkan kamera.',
      OverconstrainedError: 'Kamera tidak mendukung konfigurasi yang diminta.',
    }
    errorMessage.value = map[err.name] ?? 'Terjadi kesalahan saat mengakses kamera.'
    emit('error', err)
  }

  const overlayState = computed(() => {
    if (!props.active) return 'idle'
    if (errorMessage.value) return 'error'
    if (!isReady.value) return 'loading'
    return 'live'
  })
</script>

<template>
  <div
    class="relative aspect-4/3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900 shadow-xs"
  >
    <QrcodeStream
      v-if="active && !errorMessage"
      class="absolute inset-0 h-full w-full"
      @detect="onDetect"
      @camera-on="onCameraReady"
      @error="onCameraError"
    />

    <div v-if="overlayState === 'live'" class="pointer-events-none absolute inset-8 z-10">
      <div
        class="absolute top-0 left-0 size-10 rounded-tl-lg border-t-2 border-l-2 border-white/80"
      />
      <div
        class="absolute top-0 right-0 size-10 rounded-tr-lg border-t-2 border-r-2 border-white/80"
      />
      <div
        class="absolute bottom-0 left-0 size-10 rounded-bl-lg border-b-2 border-l-2 border-white/80"
      />
      <div
        class="absolute right-0 bottom-0 size-10 rounded-br-lg border-r-2 border-b-2 border-white/80"
      />
      <div
        class="animate-scan-sweep via-primary-400 pointer-events-none absolute top-0 right-4 left-4 h-0.5 bg-linear-to-r from-transparent to-transparent drop-shadow-[0_0_6px_var(--color-primary-400)]"
      />
    </div>

    <div
      v-if="overlayState === 'idle'"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-linear-to-b from-neutral-800 to-neutral-900 p-6 text-center"
    >
      <span
        class="flex size-16 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm"
      >
        <Camera class="size-8" />
      </span>
      <div class="max-w-sm space-y-1">
        <p class="body-l-semibold text-white">Kamera belum aktif</p>
        <p class="body-caption text-neutral-300">
          Klik tombol di bawah untuk memulai. Pastikan mengizinkan akses kamera.
        </p>
      </div>
      <Button variant="primary" size="lg" :disabled="disabled" @click="emit('start')">
        <Camera class="size-4" />
        Aktifkan Kamera
      </Button>
    </div>

    <div
      v-else-if="overlayState === 'loading'"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-neutral-900/60 backdrop-blur-sm"
    >
      <Loader2 class="size-8 animate-spin text-white" />
      <p class="body-caption text-white">Menyiapkan kamera...</p>
    </div>

    <div
      v-else-if="overlayState === 'error'"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-neutral-900/95 p-6 text-center"
    >
      <span
        class="bg-error-500/20 text-error-300 flex size-14 items-center justify-center rounded-lg"
      >
        <VideoOff class="size-7" />
      </span>
      <p class="body-m-semibold text-white">Tidak dapat mengakses kamera</p>
      <p class="body-caption max-w-sm text-neutral-300">{{ errorMessage }}</p>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <Button variant="secondary" size="md" @click="emit('start')">
          <Camera class="size-4" />
          Coba Lagi
        </Button>
        <Button variant="primary" size="md" @click="emit('manual')">
          <KeyRound class="size-4" />
          Input Kode Manual
        </Button>
      </div>
    </div>

    <template v-if="overlayState === 'live'">
      <div
        class="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
      >
        <span class="bg-error-500 size-2 animate-pulse rounded-full" />
        LIVE
      </div>
      <button
        type="button"
        class="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60"
        @click="emit('stop')"
      >
        <VideoOff class="size-3.5" />
        Hentikan
      </button>
    </template>

    <div
      v-if="hint && overlayState === 'live'"
      class="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 bg-linear-to-t from-black/60 to-transparent py-4 text-white"
    >
      <ScanLine class="size-4" />
      <span class="body-caption font-medium">{{ hint }}</span>
    </div>
  </div>
</template>
