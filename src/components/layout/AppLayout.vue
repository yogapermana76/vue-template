<script setup lang="ts">
  import { config } from '@/config'
</script>

<template>
  <div
    class="bg-background mx-auto flex h-full flex-col shadow-xl"
    :style="{ maxWidth: `${config.ui.maxWidth}px` }"
  >
    <slot />
  </div>

  <div class="bg-muted/50 fixed inset-0 -z-10" />
</template>
