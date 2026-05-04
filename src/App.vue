<script setup lang="ts">
  import { AppLayout } from '@/components/layout'
  import { TransitionedRouterView } from '@/components/shared'
  import { Toaster } from '@/components/ui/sonner'
  import { useAppInit } from '@/composables/app'

  // Initialize app (auth, watchers, etc.)
  useAppInit()
</script>

<template>
  <AppLayout>
    <TransitionedRouterView />
  </AppLayout>
  <Toaster />
</template>
