<script setup lang="ts">
  import { Camera, ScanBarcode } from 'lucide-vue-next'

  export type ScannerMode = 'camera' | 'gun'

  defineProps<{
    modelValue: ScannerMode
  }>()

  defineEmits<{
    'update:modelValue': [value: ScannerMode]
  }>()

  const options: { key: ScannerMode; label: string; icon: typeof Camera }[] = [
    { key: 'camera', label: 'Kamera', icon: Camera },
    { key: 'gun', label: 'Gun Scanner', icon: ScanBarcode },
  ]
</script>

<template>
  <div class="inline-flex w-fit gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
    <button
      v-for="opt in options"
      :key="opt.key"
      type="button"
      :class="[
        'body-caption inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition',
        modelValue === opt.key
          ? 'text-primary-700 bg-white shadow-xs'
          : 'text-neutral-600 hover:text-neutral-900',
      ]"
      @click="$emit('update:modelValue', opt.key)"
    >
      <component :is="opt.icon" class="size-3.5" />
      {{ opt.label }}
    </button>
  </div>
</template>
