<script setup lang="ts">
  import { onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { RouterView } from 'vue-router'
  import { AppLayout } from '@/components/layout'
  import { Toaster } from '@/components/ui/sonner'
  import { useTokenAuth } from '@/composables/auth'

  const route = useRoute()
  const { processAuth } = useTokenAuth()

  onMounted(() => {
    processAuth(route.query.token as string | undefined)
  })

  watch(
    () => route.query.token,
    newToken => {
      processAuth(newToken as string | undefined)
    },
  )
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster />
</template>
