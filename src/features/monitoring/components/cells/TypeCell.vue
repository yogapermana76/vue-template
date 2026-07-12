<script setup lang="ts">
  defineProps<{ value?: unknown }>()
</script>

<template>
  <span class="body-m text-neutral-700">{{ value || '—' }}</span>
</template>
