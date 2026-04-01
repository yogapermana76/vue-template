<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import type { Component } from 'vue'

  interface NavItem {
    name: string
    to: string
    icon: Component
  }

  defineProps<{
    navigation: NavItem[]
    maxWidth: number
  }>()
</script>

<template>
  <nav
    class="bg-background/95 supports-backdrop-filter:bg-background/60 safe-area-inset-bottom fixed bottom-0 left-1/2 w-full -translate-x-1/2 border-t backdrop-blur"
    :style="{ maxWidth: `${maxWidth}px` }"
  >
    <div class="flex h-16 items-center justify-around">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.to"
        class="flex h-full flex-1 flex-col items-center justify-center gap-1 text-neutral-400 transition-colors"
        active-class="!text-primary-500 font-semibold"
        exact-active-class="!text-primary-500 font-semibold"
      >
        <component :is="item.icon" class="size-5" />
        <span class="text-xs font-medium">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
  .safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
