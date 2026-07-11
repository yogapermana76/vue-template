<script setup lang="ts">
  import LoketStatCard from './LoketStatCard.vue'
  import { LOKET_STAT_CARDS } from '../constants'
  import type { LoketStatistics } from '@/types/services/loket'

  defineProps<{
    statistics: LoketStatistics | undefined
    loading?: boolean
  }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <LoketStatCard
      v-for="card in LOKET_STAT_CARDS"
      :key="card.key"
      :card="card"
      :value="statistics ? (statistics[card.key] as number) : undefined"
      :loading="loading"
    />
  </div>
</template>
