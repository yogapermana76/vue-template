<script setup lang="ts">
  import StatCard from './StatCard.vue'
  import { STAT_CARDS } from '../constants'
  import type { Statistics } from '@/types/services'

  defineProps<{
    statistics: Statistics | undefined
    loading?: boolean
  }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <StatCard
      v-for="card in STAT_CARDS"
      :key="card.key"
      :card="card"
      :value="statistics ? (statistics[card.key] as number) : undefined"
      :loading="loading"
    />
  </div>
</template>
