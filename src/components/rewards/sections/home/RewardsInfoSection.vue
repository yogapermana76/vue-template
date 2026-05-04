<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { PointsInfo, ActiveUntilBadge, WinnerInfoSwiper } from './info-section'
  import { usePointSummary, useWinnersCategory } from '@/composables/services'
  import { formatDate } from '@/utils/date'
  import type { WinnerCategory } from '@/types'

  interface WinnerItem {
    id: string | number
    title: string
    description: string
  }

  const router = useRouter()

  // Fetch point summary
  const { data: pointSummaryData } = usePointSummary()

  // Fetch winners category
  const { data: winnersCategoryData, isPending: isLoadingWinners } = useWinnersCategory({
    query: {
      page: 0,
      size: 10,
    },
  })

  // Extract points from API
  const points = computed(() => pointSummaryData.value?.data?.balance ?? 0)

  // Extract active until date from API
  const activeUntil = computed(() => {
    const endDate = pointSummaryData.value?.data?.endDate
    return endDate ? formatDate(endDate, 'dd MMM yyyy') : ''
  })

  // Transform winners category data
  const winnerItems = computed<WinnerItem[]>(() => {
    // Type assertion for response data
    const response = winnersCategoryData.value as { data?: { data?: WinnerCategory[] } } | undefined
    const categories = response?.data?.data

    if (!categories || !Array.isArray(categories)) return []

    return categories.map(item => ({
      id: item.lotteryId,
      title: item.title,
      description: `Periode ${formatDate(item.startDate, 'dd MMM yyyy')} - ${formatDate(item.endDate, 'dd MMM yyyy')}`,
    }))
  })

  const handleViewRewards = () => {
    router.push('/rewards/my-rewards')
  }

  const handleViewWinners = (itemId: string | number) => {
    router.push({
      path: '/rewards/winners',
      query: { lotteryId: itemId },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-5 pb-5">
    <!-- Points Info -->
    <PointsInfo :points="points" @view-rewards="handleViewRewards" />

    <!-- Active Until Badge -->
    <ActiveUntilBadge :active-until="activeUntil" />

    <!-- Winner Info Cards -->
    <WinnerInfoSwiper
      v-if="isLoadingWinners || winnerItems.length > 0"
      :items="winnerItems"
      :is-loading="isLoadingWinners"
      @click="handleViewWinners"
    />
  </div>
</template>
