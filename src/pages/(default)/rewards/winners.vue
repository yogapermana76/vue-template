<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { useQueryClient } from '@tanstack/vue-query'
  import { Header, GradientSection } from '@/components/layout'
  import {
    WinnerCard,
    WinnerCardSkeleton,
    type WinnerData,
    WinnerInformationBottomSheet,
  } from '@/components/rewards'
  import { IconButton } from '@/components/ui/button'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { EmptyState } from '@/components/ui/empty-state'
  import {
    useWinnerListInfinite,
    usePublicWinnerTnc,
    winnerKeys,
    publicKeys,
  } from '@/composables/services'
  import { useResponsiveMaxWidth, usePullToRefresh } from '@/composables/ui'
  import { formatDate } from '@/utils/date'
  import { AlertCircle } from 'lucide-vue-next'
  import type { Winner } from '@/types'
  import PemenangIllustration from '@/assets/illustrations/riwayat.svg'
  import { PullToRefresh } from '@/components/shared'

  definePage({
    meta: {
      title: 'Pemenang',
    },
  })

  const queryClient = useQueryClient()

  const route = useRoute()
  const isInfoOpen = ref(false)
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Get lotteryId from query params
  const lotteryId = computed(() => {
    const queryId = route.query.lotteryId
    if (typeof queryId === 'string') {
      const parsed = parseInt(queryId)
      return isNaN(parsed) ? undefined : parsed
    }
    return undefined
  })

  const {
    data: winnersData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWinnerListInfinite({
    query: {
      size: 10,
      timingCategory: 'MONTHLY',
      lotteryId: lotteryId,
    },
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

  // Fetch Winner Terms & Conditions
  const { data: winnerTncData, isPending: isTncLoading } = usePublicWinnerTnc()

  // Extract TnC items from API
  const tncItems = computed(() => {
    const items = winnerTncData.value?.data
    if (!items || !Array.isArray(items)) return []
    return items
  })

  // Dynamic period label from API response (Single Source of Truth)
  const periodLabel = computed(() => {
    // Priority 1: Generate from first winner's dates
    const firstWinner = allWinners.value[0]
    if (firstWinner?.startDate && firstWinner?.drawnDate) {
      const startFormatted = formatDate(firstWinner.startDate, 'MMMM yyyy')
      const endFormatted = formatDate(firstWinner.drawnDate, 'MMMM yyyy')
      return `Pemenang Undian Periode ${startFormatted} - ${endFormatted}`
    }

    // Priority 2: Generate from detailUserWinner dates
    if (currentUser.value?.startDate && currentUser.value?.drawnDate) {
      const startFormatted = formatDate(currentUser.value.startDate, 'MMMM yyyy')
      const endFormatted = formatDate(currentUser.value.drawnDate, 'MMMM yyyy')
      return `Pemenang Undian Periode ${startFormatted} - ${endFormatted}`
    }

    // Default fallback
    return 'Pemenang Undian'
  })

  interface WinnerItem {
    rank: number
    prize: string
    winner: WinnerData
    prizeImage: string
  }

  const allWinners = computed(() => {
    if (!winnersData.value?.pages) return []
    const allData: Winner[] = winnersData.value.pages.flatMap(page => page.data ?? [])
    return allData
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => winnersData.value?.pages?.length ?? 0)

  const currentUser = computed(() => winnersData.value?.pages?.[0]?.detailUserWinner)

  const featuredWinners = computed<WinnerItem[]>(() => {
    return allWinners.value.slice(0, 3).map((winner, index) => ({
      rank: winner.index ?? index + 1,
      prize: winner.title,
      winner: {
        name: winner.fullname,
        email: winner.email,
        phone: winner.phoneNumber,
      },
      prizeImage: winner.img || 'https://via.placeholder.com/56',
    }))
  })

  const otherWinners = computed<WinnerItem[]>(() => {
    return allWinners.value.slice(3).map((winner, index) => ({
      rank: winner.index ?? index + 4,
      prize: winner.title,
      winner: {
        name: winner.fullname,
        email: winner.email,
        phone: winner.phoneNumber,
      },
      prizeImage: winner.img || 'https://via.placeholder.com/56',
    }))
  })

  const currentUserCard = computed<WinnerItem | null>(() => {
    if (!currentUser.value) return null
    return {
      rank: currentUser.value.index ?? 0,
      prize: currentUser.value.title || '',
      winner: {
        name: currentUser.value.fullname || 'Anda',
        email: currentUser.value.email || '',
        phone: currentUser.value.phoneNumber || '',
      },
      prizeImage: currentUser.value.img || 'https://via.placeholder.com/56',
    }
  })

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()

  // Dynamic padding bottom based on currentUserCard
  const mainPaddingClass = computed(() => (currentUserCard.value ? 'pb-32' : 'pb-4'))

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: winnerKeys.listInfinite() }),
        queryClient.invalidateQueries({ queryKey: publicKeys.winnerTnc() }),
      ])
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <Header title="Pemenang" positioning="fixed" transparent>
    <template #actions="{ isDarkBg, iconClass }">
      <IconButton
        variant="tertiary"
        :class="['-mr-2', iconClass]"
        :is-dark-bg="isDarkBg"
        @click="isInfoOpen = true"
      >
        <AlertCircle />
      </IconButton>
    </template>
  </Header>

  <GradientSection gradient="teal" class="pt-14">
    <div v-if="isPending" class="z-10 flex flex-col gap-2 px-4 pb-8">
      <WinnerCardSkeleton v-for="i in 3" :key="i" :show-rank-icon="true" />
    </div>

    <div v-else-if="isError" class="z-10 flex flex-col items-center justify-center gap-2 px-4 pb-8">
      <EmptyState
        :image="PemenangIllustration"
        title="Gagal memuat data"
        description="Terjadi kesalahan saat memuat data pemenang. Silakan coba lagi."
      />
    </div>

    <template v-else>
      <div v-if="featuredWinners.length > 0" class="z-10 flex justify-center px-4 pb-3">
        <div
          class="flex flex-row items-center justify-between gap-1 rounded-full bg-slate-800/30 px-4 py-2 backdrop-blur-md"
        >
          <span class="body-caption-semibold flex-1 text-center text-white">
            {{ periodLabel }}
          </span>
        </div>
      </div>

      <div
        v-if="featuredWinners.length === 0"
        class="z-10 flex flex-col items-center justify-center px-4 pb-8"
      >
        <EmptyState
          :image="PemenangIllustration"
          title="Belum ada pemenang"
          description="Saat ini belum ada pemenang untuk periode ini."
          class="[&_h3]:text-white! [&_p]:text-white/80!"
        />
      </div>

      <div v-else class="z-10 flex flex-col gap-2 px-4 pb-8">
        <WinnerCard
          v-for="item in featuredWinners"
          :key="item.rank"
          :rank="item.rank"
          :prize="item.prize"
          :winner="item.winner"
          :prize-image="item.prizeImage"
          :show-rank-icon="true"
        />
      </div>
    </template>
  </GradientSection>

  <main :class="['flex flex-1 flex-col gap-2 px-4', mainPaddingClass]">
    <div v-if="isPending" class="flex flex-col gap-2">
      <WinnerCardSkeleton v-for="i in 5" :key="i" />
    </div>

    <div v-else-if="isError" class="flex flex-1 flex-col items-center justify-center py-8">
      <EmptyState
        :image="PemenangIllustration"
        title="Gagal memuat data"
        description="Terjadi kesalahan saat memuat data pemenang. Silakan coba lagi."
      />
    </div>

    <template v-else>
      <div
        v-if="otherWinners.length === 0 && featuredWinners.length === 0"
        class="flex flex-1 flex-col items-center justify-center py-8"
      >
        <EmptyState
          :image="PemenangIllustration"
          title="Belum ada pemenang"
          description="Saat ini belum ada pemenang untuk periode ini."
        />
      </div>

      <template v-else>
        <WinnerCard
          v-for="item in otherWinners"
          :key="item.rank"
          :rank="item.rank"
          :prize="item.prize"
          :winner="item.winner"
          :prize-image="item.prizeImage"
        />

        <!-- Infinite Scroll Trigger -->
        <div ref="loadMoreRef">
          <InfiniteScrollTrigger
            :is-fetching="isFetchingNextPage"
            :has-more="hasNextPage"
            :current-page="currentPageCount"
          />
        </div>
      </template>
    </template>
  </main>

  <div
    v-if="currentUserCard"
    class="fixed inset-x-0 bottom-0 z-40 mx-auto"
    :style="responsiveMaxWidthStyle"
  >
    <WinnerCard
      :rank="currentUserCard.rank"
      :prize="currentUserCard.prize"
      :winner="currentUserCard.winner"
      :prize-image="currentUserCard.prizeImage"
      variant="featured"
      :highlighted-content="true"
      class="rounded-b-none"
      content-class="rounded-b-none"
    />
  </div>

  <WinnerInformationBottomSheet
    v-model:open="isInfoOpen"
    :is-tnc-loading="isTncLoading"
    :tnc-items="tncItems"
  />
</template>
