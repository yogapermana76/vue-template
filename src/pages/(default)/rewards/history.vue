<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useIntersectionObserver } from '@vueuse/core'
  import { useQueryClient } from '@tanstack/vue-query'
  import { Header } from '@/components/layout'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import {
    PointsInfoSection,
    TransactionHistorySection,
  } from '@/components/rewards/sections/history'
  import { RewardsTransactionCardSkeleton } from '@/components/rewards'
  import { usePointHistoryInfinite, usePointSummary, pointKeys } from '@/composables/services'
  import { formatDate } from '@/utils/date'
  import type { PointHistoryItem } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/history.png'
  import { PullToRefresh } from '@/components/shared'
  import { usePullToRefresh } from '@/composables/ui'

  definePage({
    meta: {
      title: 'Riwayat Penukaran Point',
    },
  })

  const queryClient = useQueryClient()

  interface TransactionItem {
    id: number
    title: string
    date: string
    points: number
  }

  interface TransactionGroup {
    label: string
    transactions: TransactionItem[]
  }

  const loadMoreRef = ref<HTMLElement | null>(null)

  const { data: pointSummaryData, isPending: isSummaryPending } = usePointSummary()

  const {
    data: pointHistoryData,
    isPending: isHistoryPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePointHistoryInfinite({
    query: { size: 10 },
  })

  // Intersection observer for infinite scroll
  useIntersectionObserver(
    loadMoreRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    },
    { threshold: 0.1 },
  )

  const points = computed(() => pointSummaryData.value?.data?.balance ?? 0)
  const activeUntil = computed(() => {
    const endDate = pointSummaryData.value?.data?.endDate
    return endDate ? formatDate(endDate, 'dd MMM yyyy') : ''
  })

  const isPending = computed(() => isSummaryPending.value || isHistoryPending.value)

  const transactionHistory = computed<TransactionGroup[]>(() => {
    if (!pointHistoryData.value?.pages) return []

    const allItems: PointHistoryItem[] = pointHistoryData.value.pages.flatMap(
      page => page.data ?? [],
    )

    const grouped = new Map<string, TransactionItem[]>()

    allItems.forEach(item => {
      const label = formatDate(item.created, 'dd MMMM yyyy')

      if (!grouped.has(label)) {
        grouped.set(label, [])
      }

      grouped.get(label)!.push({
        id: item.id,
        title: item.activity,
        date: formatDate(item.created, 'dd MMM yyyy, HH:mm') + ' WIB',
        points: item.point,
      })
    })

    return Array.from(grouped.entries()).map(([label, transactions]) => ({
      label,
      transactions,
    }))
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => pointHistoryData.value?.pages?.length ?? 0)

  const hasData = computed(() => transactionHistory.value.length > 0)

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await Promise.all([
        queryClient.resetQueries({ queryKey: pointKeys.summary() }),
        queryClient.resetQueries({ queryKey: ['point', 'history-infinite'] }),
      ])
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <Header title="Riwayat" positioning="sticky" />

  <PointsInfoSection
    v-if="hasData"
    :points="points"
    :active-until="activeUntil"
    class="sticky top-12 z-10 bg-white px-4 py-4"
  />

  <main class="flex flex-1 flex-col px-4 py-4">
    <!-- Skeleton Loading State -->
    <div v-if="isPending" class="flex flex-col gap-6">
      <!-- First Group -->
      <div class="flex flex-col gap-3">
        <div class="h-5 w-32 animate-pulse rounded-sm bg-slate-200" />
        <div class="flex flex-col gap-2">
          <RewardsTransactionCardSkeleton v-for="i in 3" :key="`group1-${i}`" />
        </div>
      </div>

      <!-- Second Group -->
      <div class="flex flex-col gap-3">
        <div class="h-5 w-32 animate-pulse rounded-sm bg-slate-200" />
        <div class="flex flex-col gap-2">
          <RewardsTransactionCardSkeleton v-for="i in 2" :key="`group2-${i}`" />
        </div>
      </div>
    </div>

    <div v-else-if="isError" class="flex flex-1 flex-col items-center justify-center">
      <p class="body-m text-slate-500">Gagal memuat data. Silakan coba lagi.</p>
    </div>

    <div v-else-if="!hasData" class="flex flex-1 flex-col items-center justify-center">
      <EmptyState
        :image="RiwayatIllustration"
        title="Belum ada riwayat"
        description="Anda belum memiliki riwayat penukaran point. Mulai tukar poin anda sekarang!"
      />
    </div>

    <template v-else>
      <TransactionHistorySection :transaction-history="transactionHistory" />

      <!-- Infinite Scroll Trigger -->
      <div ref="loadMoreRef">
        <InfiniteScrollTrigger
          :is-fetching="isFetchingNextPage"
          :has-more="hasNextPage"
          :current-page="currentPageCount"
        />
      </div>
    </template>
  </main>
</template>
