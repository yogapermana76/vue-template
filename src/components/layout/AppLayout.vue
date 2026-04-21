<script setup lang="ts">
  import { useResponsiveMaxWidth } from '@/composables/ui'

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()
</script>

<template>
  <div
    class="bg-background mx-auto flex min-h-screen flex-col shadow-xl"
    :style="responsiveMaxWidthStyle"
  >
    <slot />
  </div>

  <div class="bg-muted/50 fixed inset-0 -z-10" />
</template>
