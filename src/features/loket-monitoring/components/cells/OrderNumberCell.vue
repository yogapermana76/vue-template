<script setup lang="ts">
  defineProps<{ value?: unknown }>()
</script>

<template>
  <span class="body-m font-mono text-neutral-700">{{ value || '—' }}</span>
</template>
