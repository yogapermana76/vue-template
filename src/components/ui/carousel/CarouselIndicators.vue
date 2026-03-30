<script setup lang="ts">
  interface Props {
    total: number
    selected: number
  }

  defineProps<Props>()

  const emit = defineEmits<{
    'dot-click': [index: number]
  }>()
</script>

<template>
  <div class="flex items-center justify-center gap-2 pt-4">
    <button
      v-for="(_, index) in Array(total)"
      :key="index"
      :class="[
        'h-2 rounded-full transition-all',
        selected === index ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2',
      ]"
      @click="emit('dot-click', index)"
    />
  </div>
</template>
