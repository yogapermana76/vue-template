<script setup lang="ts">
  import { ScanLine } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { useLoketScanModal } from '../composables/useLoketScanModal'

  // Mobile FAB is teleported to <body> to escape ancestors with `backdrop-filter`
  // (which would otherwise create a containing block and pin the fixed element).
  const { openScan } = useLoketScanModal()
</script>

<template>
  <Button
    variant="secondary"
    size="md"
    aria-label="Scan tiket"
    class="hidden shrink-0 lg:inline-flex"
    @click="() => openScan()"
  >
    <ScanLine class="size-4" />
    <span>Scan Tiket</span>
  </Button>

  <Teleport to="body">
    <button
      type="button"
      aria-label="Scan tiket"
      class="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 fixed bottom-6 left-1/2 z-50 flex size-16 -translate-x-1/2 flex-col items-center justify-center gap-0.5 rounded-full border-4 border-white text-white shadow-lg transition-all hover:shadow-xl lg:hidden"
      @click="() => openScan()"
    >
      <ScanLine class="size-6 shrink-0" />
      <span class="text-xxs leading-tight font-semibold">Scan</span>
    </button>
  </Teleport>
</template>
