<script setup lang="ts">
  import type { Component } from 'vue'
  import { StatsCard } from '@/components/demo/dashboard'

  interface Stat {
    title: string
    value: string | number
    change?: string
    icon?: Component
  }

  interface Props {
    stats: Stat[]
  }

  defineProps<Props>()
</script>

<template>
  <div class="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
    <StatsCard
      v-for="stat in stats"
      :key="stat.title"
      :title="stat.title"
      :value="stat.value"
      :change="stat.change"
      :icon="stat.icon"
      class="w-32 min-w-32 shrink-0"
    />
  </div>
</template>
