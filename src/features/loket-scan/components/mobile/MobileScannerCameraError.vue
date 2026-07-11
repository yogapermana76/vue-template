<script setup lang="ts">
  import { KeyRound, VideoOff } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  defineProps<{ message: string }>()

  defineEmits<{ 'open-manual': [] }>()
</script>

<template>
  <div
    class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center"
  >
    <span
      class="bg-error-500/20 text-error-300 flex size-16 items-center justify-center rounded-lg"
    >
      <VideoOff class="size-8" />
    </span>
    <p class="body-l-semibold text-white">Kamera tidak tersedia</p>
    <p class="body-m max-w-xs text-neutral-400">{{ message }}</p>
    <Button variant="secondary" size="md" class="mt-2" @click="$emit('open-manual')">
      <KeyRound class="size-4" />
      Input Kode Manual
    </Button>
  </div>
</template>
