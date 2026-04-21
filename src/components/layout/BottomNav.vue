<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import type { Component } from 'vue'
  import { useResponsiveMaxWidth } from '@/composables/ui'

  interface NavItem {
    name: string
    to: string
    icon: Component
  }

  defineProps<{
    navigation: NavItem[]
  }>()

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()
</script>

<template>
  <nav
    class="safe-bottom fixed bottom-0 left-1/2 w-full -translate-x-1/2 rounded-t-2xl border border-neutral-100 bg-white"
    :style="responsiveMaxWidthStyle"
  >
    <div class="flex items-center justify-between gap-4 px-4 py-3">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.to"
        v-slot="{ isExactActive }"
        class="nav-item group relative flex flex-1 flex-col items-center justify-center gap-1"
      >
        <!-- Active indicator -->
        <span
          v-if="isExactActive"
          class="bg-primary-500 absolute left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-b-xl"
          style="top: -13px"
        />
        <component
          :is="item.icon"
          class="size-5 transition-colors"
          :class="isExactActive ? 'text-primary-600' : 'text-neutral-500'"
        />
        <span
          class="body-small-semibold transition-colors"
          :class="isExactActive ? 'text-primary-700' : 'text-neutral-500'"
        >
          {{ item.name }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
