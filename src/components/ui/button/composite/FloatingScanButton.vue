<script setup lang="ts">
  import { QrCode } from 'lucide-vue-next'

  interface Props {
    label?: string
  }

  withDefaults(defineProps<Props>(), {
    label: 'Scan QR',
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const handleClick = (event: MouseEvent) => {
    emit('click', event)
  }
</script>

<template>
  <button
    @click="handleClick"
    class="fixed bottom-8 left-1/2 flex w-27 -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-full border-4 border-white bg-teal-500 py-2 shadow transition-all hover:bg-teal-600 hover:shadow-md"
    aria-label="Scan QR Code"
  >
    <QrCode class="size-5 shrink-0 text-white" />
    <span class="text-xxs leading-[16px] font-semibold text-white">{{ label }}</span>
  </button>
</template>
