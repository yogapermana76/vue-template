<script setup lang="ts">
  import { ScanLine } from 'lucide-vue-next'
</script>

<template>
  <div class="pointer-events-none absolute inset-x-12 top-1/2 z-10 aspect-square -translate-y-1/2">
    <div class="absolute top-0 left-0 size-12 rounded-tl-lg border-t-4 border-l-4 border-white" />
    <div class="absolute top-0 right-0 size-12 rounded-tr-lg border-t-4 border-r-4 border-white" />
    <div
      class="absolute bottom-0 left-0 size-12 rounded-bl-lg border-b-4 border-l-4 border-white"
    />
    <div
      class="absolute right-0 bottom-0 size-12 rounded-br-lg border-r-4 border-b-4 border-white"
    />
    <div
      class="animate-scan-sweep via-primary-400 pointer-events-none absolute inset-x-6 top-0 h-0.5 bg-linear-to-r from-transparent to-transparent drop-shadow-[0_0_6px_var(--color-primary-400)]"
    />
  </div>

  <div
    class="safe-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 bg-linear-to-t from-black/80 to-transparent px-6 pt-24 pb-12 text-center"
  >
    <ScanLine class="size-6 text-white" />
    <div class="flex flex-col items-center gap-2">
      <p class="body-m-semibold text-white">Arahkan kamera ke QR code</p>
      <p class="body-caption text-white/70">Kode akan terdeteksi otomatis</p>
    </div>
  </div>
</template>
