<script setup lang="ts">
  defineProps<{
    total: number
    activeIndex: number
  }>()

  defineEmits<{
    (event: 'select', index: number): void
  }>()
</script>

<template>
  <div class="pointer-events-auto flex items-center gap-2">
    <button
      v-for="i in total"
      :key="i"
      type="button"
      :aria-label="`Ke slide ${i}`"
      :aria-current="activeIndex === i - 1 ? 'true' : undefined"
      :class="[
        'h-1 rounded-full transition-all duration-300 ease-out',
        activeIndex === i - 1 ? 'w-11 bg-teal-400' : 'w-6 bg-white/40 hover:bg-white/60',
      ]"
      @click="$emit('select', i - 1)"
    />
  </div>
</template>
