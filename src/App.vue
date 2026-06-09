<script setup lang="ts">
  import { AppLayout } from '@/components/layout'
  import { TransitionedRouterView } from '@/components/shared'
  import { Toaster } from '@/components/ui/sonner'
  import { useAppInit } from '@/composables/app'
  import { config } from '@/config'

  // Initialize app (auth, watchers, etc.)
  useAppInit()

  /**
   * Conditional layout based on UI mode:
   * - native/auto: Uses AppLayout with maxWidth constraint and safe area
   * - browser: Direct render without layout wrapper for full-width
   */
  const isNativeMode = config.ui.mode !== 'browser'
</script>

<template>
  <AppLayout v-if="isNativeMode">
    <TransitionedRouterView />
  </AppLayout>
  <TransitionedRouterView v-else />
  <Toaster />
</template>
