<script setup lang="ts">
  import { Loader2 } from 'lucide-vue-next'
</script>

<template>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-950">
    <Loader2 class="size-10 animate-spin text-white" />
    <p class="body-m text-white">Membuka kamera...</p>
  </div>
</template>
