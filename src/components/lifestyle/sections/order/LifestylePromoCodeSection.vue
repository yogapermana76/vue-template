<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'

  defineEmits<{
    'apply-promo': []
  }>()
</script>

<template>
  <button
    type="button"
    class="from-primary-600 to-primary-700 flex w-full items-center gap-3 rounded-lg bg-gradient-to-r p-3 transition-opacity hover:opacity-90"
    @click="$emit('apply-promo')"
  >
    <!-- Icon -->
    <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
      <svg
        class="size-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="7" width="18" height="10" rx="2" />
        <path d="M3 11h18" />
        <path d="M7 15h.01" />
        <path d="M11 15h2" />
      </svg>
    </div>

    <!-- Text -->
    <div class="flex flex-1 flex-col items-start gap-0.5">
      <span class="body-m-semibold text-white">Masukkan Kode Promo</span>
    </div>

    <!-- Chevron -->
    <ChevronRight class="size-5 shrink-0 text-white" />
  </button>
</template>
