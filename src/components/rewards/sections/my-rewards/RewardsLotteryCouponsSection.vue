<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Clock, Ticket } from 'lucide-vue-next'
  import { RewardBannerCard, RewardBannerCardSkeleton } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { useUserLotteryListInfinite } from '@/composables/services'
  import { formatDate } from '@/utils/date'
  import type { UserLottery } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Fetch user lottery list with infinite scroll
  const {
    data: lotteryData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserLotteryListInfinite({
    query: {
      size: 10,
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

  // Transform paginated data to flat array
  const lotteryList = computed<UserLottery[]>(() => {
    if (!lotteryData.value?.pages) return []
    return lotteryData.value.pages.flatMap(page => page.data ?? [])
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => lotteryData.value?.pages?.length ?? 0)

  // Event handler
  const handleLotteryCouponClick = (id: number) => {
    router.push({
      path: `/rewards/my-rewards/${id}`,
      query: { type: 'lottery-coupon' },
    })
  }

  // Format duration text
  const formatDuration = (startDate: string, endDate: string) => {
    const start = formatDate(startDate, 'MMMM yyyy')
    const end = formatDate(endDate, 'MMMM yyyy')
    return `${start} - ${end}`
  }
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Loading Skeleton -->
    <template v-if="isPending">
      <RewardBannerCardSkeleton v-for="i in 3" :key="`skeleton-${i}`" />
    </template>

    <!-- Error State -->
    <EmptyState
      v-else-if="isError"
      :image="RiwayatIllustration"
      title="Gagal memuat kupon undian"
      description="Terjadi kesalahan saat memuat kupon undian. Silakan coba lagi."
    />

    <!-- Content -->
    <template v-else-if="lotteryList.length > 0">
      <div v-for="coupon in lotteryList" :key="coupon.id" class="w-full">
        <RewardBannerCard
          :title="coupon.title"
          :image-url="coupon.imageUrl"
          :duration-text="formatDuration(coupon.startDate, coupon.endDate)"
          :duration-icon="Clock"
          :status-icon="Ticket"
          :status-text="coupon.redeemCount > 0 ? `${coupon.redeemCount} Kupon` : undefined"
          button-label="Lihat Detail"
          @button-click="handleLotteryCouponClick(coupon.id)"
          @card-click="handleLotteryCouponClick(coupon.id)"
        />
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="loadMoreRef">
        <InfiniteScrollTrigger
          :is-fetching="isFetchingNextPage"
          :has-more="hasNextPage"
          :current-page="currentPageCount"
        />
      </div>
    </template>

    <!-- Empty State -->
    <EmptyState
      v-else
      :image="RiwayatIllustration"
      title="Kupon undian belum tersedia"
      description="Mohon maaf kupon undian sedang tidak tersedia untuk saat ini."
    />
  </div>
</template>
