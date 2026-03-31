<script setup lang="ts">
  import { RouterView, useRouter } from 'vue-router'
  import { Home, Package, LayoutDashboard, Layers } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { MobileHeader, BottomNav } from '@/components/layout'
  import { config } from '@/config'

  const router = useRouter()

  const navigation = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'Products', to: '/products', icon: Package },
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Tabs', to: '/tabs', icon: Layers },
  ]

  const isNestedPage = computed(() => {
    const path = router.currentRoute.value.path
    return path.split('/').filter(Boolean).length > 1
  })

  const pageTitle = computed(() => {
    return router.currentRoute.value.meta?.title || config.app.name
  })
</script>

<template>
  <div
    class="bg-background mx-auto flex min-h-screen flex-col shadow-xl"
    :style="{ maxWidth: `${config.ui.maxWidth}px` }"
  >
    <MobileHeader :title="pageTitle" :show-back="isNestedPage" @back="router.back()" />

    <main class="flex-1 py-4 pb-20">
      <RouterView />
    </main>

    <BottomNav :navigation="navigation" :max-width="config.ui.maxWidth" />
  </div>

  <div class="bg-muted/50 fixed inset-0 -z-10" />
</template>
