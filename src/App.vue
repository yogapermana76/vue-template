<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { AppLayout } from '@/components/layout'
  import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster />
</template>
