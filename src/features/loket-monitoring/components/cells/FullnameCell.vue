<script setup lang="ts">
  defineProps<{ value?: unknown }>()
</script>

<template>
  <span class="body-m-medium text-neutral-950">{{ value || '—' }}</span>
</template>
