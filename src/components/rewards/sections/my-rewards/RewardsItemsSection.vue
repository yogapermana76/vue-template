<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Check } from 'lucide-vue-next'
  import { RewardCouponCard, RewardCouponCardSkeleton } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { useUserGiftInstantlyInfinite } from '@/composables/services'
  import type { UserGiftInstantly } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Fetch user gift instantly items with infinite scroll
  const {
    data: giftInstantlyData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserGiftInstantlyInfinite({
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
  const itemsList = computed<UserGiftInstantly[]>(() => {
    if (!giftInstantlyData.value?.pages) return []
    return giftInstantlyData.value.pages.flatMap(page => page.data ?? [])
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => giftInstantlyData.value?.pages?.length ?? 0)

  // Event handler
  const handleItemClick = (tUserPointId: number) => {
    router.push({
      path: `/rewards/my-rewards/${tUserPointId}`,
      query: { type: 'item' },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Loading Skeleton -->
    <template v-if="isPending">
      <RewardCouponCardSkeleton v-for="i in 3" :key="`skeleton-${i}`" />
    </template>

    <!-- Error State -->
    <EmptyState
      v-else-if="isError"
      :image="RiwayatIllustration"
      title="Gagal memuat barang"
      description="Terjadi kesalahan saat memuat barang. Silakan coba lagi."
    />

    <!-- Content -->
    <template v-else-if="itemsList.length > 0">
      <div v-for="item in itemsList" :key="item.tUserPointId" class="w-full">
        <RewardCouponCard
          :title="item.title"
          :image-url="item.imageUrl || 'https://via.placeholder.com/343x171?text=No+Image'"
          button-label="Lihat Detail"
          @button-click="handleItemClick(item.tUserPointId)"
          @card-click="handleItemClick(item.tUserPointId)"
        >
          <template #footer>
            <div class="flex flex-1 items-center gap-1">
              <Check class="size-4 shrink-0 text-teal-600" :stroke-width="4" />
              <span class="body-caption-medium text-teal-700"> Sudah ditukar </span>
            </div>
          </template>
        </RewardCouponCard>
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
      title="Barang belum tersedia"
      description="Mohon maaf barang sedang tidak tersedia untuk saat ini."
    />
  </div>
</template>
