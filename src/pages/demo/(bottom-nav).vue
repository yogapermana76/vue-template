<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { Home, Package, LayoutDashboard, Layers } from 'lucide-vue-next'
  import { BottomNav } from '@/components/layout'

  const navigation = [
    { name: 'Home', to: '/demo', icon: Home },
    { name: 'Products', to: '/demo/products', icon: Package },
    { name: 'Dashboard', to: '/demo/dashboard', icon: LayoutDashboard },
    { name: 'Tabs', to: '/demo/tabs', icon: Layers },
  ]
</script>

<template>
  <div class="contents">
    <main class="flex-1 pb-20">
      <RouterView />
    </main>

    <BottomNav :navigation="navigation" />
  </div>
</template>
