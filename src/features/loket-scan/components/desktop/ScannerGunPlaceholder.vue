<script setup lang="ts">
  import { ScanBarcode } from 'lucide-vue-next'
  import LoketManualCodeInput from '../LoketManualCodeInput.vue'

  defineEmits<{
    submit: [code: string]
  }>()
</script>

<template>
  <div
    class="from-primary-50/40 flex flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-300 bg-linear-to-b to-white px-6 py-10 text-center"
  >
    <span
      class="bg-primary-100 text-primary-700 flex size-14 items-center justify-center rounded-lg"
    >
      <ScanBarcode class="size-7" />
    </span>
    <div class="max-w-md">
      <p class="body-l-semibold text-neutral-950">Siap menerima gun scanner</p>
      <p class="body-m mt-1 text-neutral-600">
        Arahkan gun scanner ke QR code tiket. Kode akan dibaca sebagai keyboard input dan
        diverifikasi otomatis setelah Enter.
      </p>
    </div>
    <LoketManualCodeInput class="w-full max-w-md" @submit="code => $emit('submit', code)" />
  </div>
</template>
