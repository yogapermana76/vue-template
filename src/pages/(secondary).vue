<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'
  import { computed, unref } from 'vue'
  import { Header } from '@/components/layout'
  import { config } from '@/config'
  import type { HeaderProps } from '@/types/header'
  import { defaultHeaderProps } from '@/types/header'

  const route = useRoute()

  // Build header props from route meta or use defaults
  const headerProps = computed<HeaderProps>(() => {
    const routeMeta = route.meta?.header as HeaderProps | undefined

    // Unwrap any Ref values in rightActions (handle computed refs)
    const rawRightActions = routeMeta?.rightActions
    const rightActions = rawRightActions ? unref(rawRightActions) : []

    // Page title has priority over header title
    const pageTitle = (route.meta?.title as string) || config.app.name

    return {
      ...defaultHeaderProps,
      ...routeMeta,
      title: pageTitle,
      showBack: true,
      rightActions,
    }
  })
</script>

<template>
  <Header v-bind="headerProps" />

  <main class="flex-1 py-4 pb-24">
    <RouterView />
  </main>
</template>
