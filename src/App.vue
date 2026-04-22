<script setup lang="ts">
  import { onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { RouterView } from 'vue-router'
  import { AppLayout } from '@/components/layout'
  import { Toaster } from '@/components/ui/sonner'
  import { useTokenAuth } from '@/composables/auth'

  const route = useRoute()
  const { processAuth, handleTokenChange } = useTokenAuth()

  onMounted(() => {
    processAuth(route.query.token as string | undefined)
  })

  watch(
    () => (route.path === '/' ? route.query.token : null),
    newToken => {
      handleTokenChange(newToken as string | undefined)
    },
  )
</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition name="page" mode="out-in">
        <KeepAlive v-if="currentRoute.meta.keepAlive" :max="5">
          <component :is="Component" :key="currentRoute.path" />
        </KeepAlive>
        <component v-else :is="Component" :key="currentRoute.path" />
      </Transition>
    </RouterView>
  </AppLayout>
  <Toaster />
</template>

<style>
  .page-enter-active {
    transition: opacity 0.15s ease-out;
  }

  .page-leave-active {
    transition: opacity 0.1s ease-in;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }
</style>
