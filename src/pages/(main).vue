<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { Home, Package, LayoutDashboard, Layers } from 'lucide-vue-next'
  import { BottomNav } from '@/components/layout'
  import { config } from '@/config'

  const navigation = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'Products', to: '/products', icon: Package },
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Tabs', to: '/tabs', icon: Layers },
  ]
</script>

<template>
  <main class="flex-1 pb-20">
    <RouterView />
  </main>

  <BottomNav :navigation="navigation" :max-width="config.ui.maxWidth" />
</template>
