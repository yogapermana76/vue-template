<script setup lang="ts">
  import StatCard from './StatCard.vue'
  import type { DashboardStat } from '../types'

  defineProps<{
    stats: DashboardStat[]
  }>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      v-for="stat in stats"
      :key="stat.title"
      :title="stat.title"
      :value="stat.value"
      :change="stat.change"
      :trend="stat.trend"
      :icon="stat.icon"
    />
  </div>
</template>
