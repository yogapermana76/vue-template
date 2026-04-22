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
    <RouterView />
  </AppLayout>
  <Toaster />
</template>
