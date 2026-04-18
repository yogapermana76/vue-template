<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { PointsInfo, ActiveUntilBadge, WinnerInfoSwiper } from './info-section'
  import { usePointSummary, useWinnersCategory } from '@/composables/services'

  interface WinnerItem {
    id: string | number
    title: string
    description: string
  }

  const router = useRouter()

  // Fetch point summary
  const { data: pointSummary, isLoading: isLoadingPoints } = usePointSummary()

  // Fetch winners category
  const { data: winnersCategory, isLoading: isLoadingWinners } = useWinnersCategory()

  // Debug: log data on change
  watch(pointSummary, val => {
    // eslint-disable-next-line no-console
    console.log('Point Summary:', val)
  })

  // Debug: log data on change
  watch(winnersCategory, val => {
    // eslint-disable-next-line no-console
    console.log('Winners Category:', val)
  })

  const points = ref(0)
  const activeUntil = ref('30 Dec 2026')

  // TODO: Replace mock data with actual API data from winnersCategory
  // Example integration:
  // const winnerItems = computed<WinnerItem[]>(() => {
  //   if (!winnersCategory.value?.data) return []
  //   return winnersCategory.value.data.map((item: any) => ({
  //     id: item.id,
  //     title: item.categoryName || 'Informasi Pemenang',
  //     description: item.period || `Undian periode ${item.startDate} - ${item.endDate}`,
  //   }))
  // })
  const winnerItems = ref<WinnerItem[]>([
    {
      id: 1,
      title: 'Informasi Pemenang',
      description: 'Undian periode Januari - Maret',
    },
    {
      id: 2,
      title: 'Informasi Pemenang',
      description: 'Undian periode April - Juni',
    },
  ])

  const handleViewRewards = () => {
    router.push('/rewards/my-rewards')
  }

  const handleViewWinners = (itemId: string | number) => {
    router.push({
      path: '/rewards/winners',
      query: { id: itemId },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-5 pb-5">
    <!-- Points Info -->
    <PointsInfo :points="points" :is-loading="isLoadingPoints" @view-rewards="handleViewRewards" />

    <!-- Active Until Badge -->
    <ActiveUntilBadge :active-until="activeUntil" :is-loading="isLoadingPoints" />

    <!-- Winner Info Cards -->
    <WinnerInfoSwiper
      :items="winnerItems"
      :is-loading="isLoadingWinners"
      @click="handleViewWinners"
    />
  </div>
</template>
