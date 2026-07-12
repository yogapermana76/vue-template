<script setup lang="ts">
  defineProps<{ value?: unknown }>()
</script>

<template>
  <span class="body-m-semibold font-mono text-neutral-950">{{ value }}</span>
</template>
