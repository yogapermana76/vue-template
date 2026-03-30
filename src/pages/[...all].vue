<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Home, ArrowLeft } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  definePage({
    meta: {
      title: '404 - Not Found',
    },
  })
</script>

<template>
  <div class="bg-background flex min-h-screen items-center justify-center px-4">
    <div class="space-y-6 text-center">
      <div class="space-y-2">
        <h1 class="text-display-2xl text-muted-foreground/30 font-bold">404</h1>
        <h2 class="text-display-sm">Page not found</h2>
        <p class="text-muted-foreground mx-auto max-w-md">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or
          the page has been moved.
        </p>
      </div>
      <div class="flex flex-col justify-center gap-4 sm:flex-row">
        <Button as-child>
          <RouterLink to="/">
            <Home class="mr-2 size-4" />
            Go Home
          </RouterLink>
        </Button>
        <Button variant="outline" @click="$router.back()">
          <ArrowLeft class="mr-2 size-4" />
          Go Back
        </Button>
      </div>
    </div>
  </div>
</template>
