<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Header, GradientSection } from '@/components/layout'
  import { WinnerCard, WinnerCardSkeleton, type WinnerData } from '@/components/rewards'
  import { InformationBottomSheet } from '@/components/shared'
  import { IconButton } from '@/components/ui/button'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { useWinnerListInfinite, usePublicWinnerTnc } from '@/composables/services'
  import { config } from '@/config'
  import { AlertCircle } from 'lucide-vue-next'
  import type { Winner } from '@/types'

  definePage({
    meta: {
      title: 'Pemenang',
    },
  })

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

  const periodLabel = 'Pemenang Undian Periode Januari - Maret 2025'

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
        phone: '',
      },
      prizeImage: currentUser.value.img || 'https://via.placeholder.com/56',
    }
  })

  const fixedCardStyle = computed(() => ({
    maxWidth: `${config.ui.maxWidth}px`,
  }))

  // Dynamic padding bottom based on currentUserCard
  const mainPaddingClass = computed(() => (currentUserCard.value ? 'pb-32' : 'pb-4'))
</script>

<template>
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
    <div class="z-10 flex justify-center px-4 pb-3">
      <div
        class="flex flex-row items-center justify-between gap-1 rounded-full bg-slate-800/30 px-4 py-2 backdrop-blur-md"
      >
        <span class="body-caption-semibold flex-1 text-center text-white">
          {{ periodLabel }}
        </span>
      </div>
    </div>

    <div v-if="isPending" class="z-10 flex flex-col gap-2 px-4 pb-8">
      <WinnerCardSkeleton v-for="i in 3" :key="i" :show-rank-icon="true" />
    </div>

    <div v-else-if="isError" class="z-10 flex flex-col gap-2 px-4 pb-8">
      <p class="body-m text-center text-white">Gagal memuat data pemenang.</p>
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
  </GradientSection>

  <main :class="['flex flex-1 flex-col gap-2 px-4', mainPaddingClass]">
    <div v-if="isPending" class="flex flex-col gap-2">
      <WinnerCardSkeleton v-for="i in 5" :key="i" />
    </div>

    <div v-else-if="isError" class="flex flex-col items-center justify-center py-8">
      <p class="body-m text-slate-500">Gagal memuat data pemenang.</p>
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
  </main>

  <div v-if="currentUserCard" class="fixed inset-x-0 bottom-0 z-40 mx-auto" :style="fixedCardStyle">
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

  <InformationBottomSheet v-model:open="isInfoOpen" title="Informasi">
    <div class="flex flex-col">
      <!-- Loading State -->
      <div v-if="isTncLoading" class="flex flex-col gap-3">
        <div class="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div class="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>

      <!-- Terms and Conditions Items -->
      <div v-else class="flex flex-col gap-4">
        <div v-for="item in tncItems" :key="item.order" class="flex flex-col gap-2">
          <h3 class="body-m-semibold text-neutral-90">{{ item.title }}</h3>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="body-caption text-neutral-80" v-html="item.value" />
        </div>
      </div>
    </div>
  </InformationBottomSheet>
</template>
