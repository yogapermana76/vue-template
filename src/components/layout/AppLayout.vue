<script setup lang="ts">
  import { computed } from 'vue'
  import { useResponsiveMaxWidth, useSafeArea } from '@/composables/ui'

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()
  const { safeAreaBottomStyle } = useSafeArea()

  const containerStyle = computed(() => ({
    ...responsiveMaxWidthStyle.value,
    ...safeAreaBottomStyle.value,
  }))
</script>

<template>
  <div class="bg-background mx-auto flex min-h-screen flex-col shadow-xl" :style="containerStyle">
    <slot />
  </div>

  <div class="bg-muted/50 fixed inset-0 -z-10" />
</template>
