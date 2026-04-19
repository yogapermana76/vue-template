<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { ScrollablePillTabs, ScrollablePillTabsSkeleton } from '@/components/ui/pill-tab'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { RewardCouponCardCompact, RewardCouponCardCompactSkeleton } from '@/components/rewards'
  import { useRewardCategories, useRewardGiftInstantlyInfinite } from '@/composables/services'
  import type { GiftInstantly } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Fetch reward categories for filter pills
  const { data: categoriesData, isPending: isCategoriesLoading } = useRewardCategories()

  // Get first category ID as default filter
  const defaultCategoryId = computed(() => categoriesData.value?.data?.[0]?.id ?? null)

  const activeCategoryId = ref<number | null>(null)

  // Set default category when categories load
  watch(
    defaultCategoryId,
    newDefaultId => {
      if (newDefaultId && !activeCategoryId.value) {
        activeCategoryId.value = newDefaultId
      }
    },
    { immediate: true },
  )

  // Convert null to undefined for API call (MaybeRef<string | number | undefined>)
  const categoryIdForApi = computed(() => activeCategoryId.value ?? undefined)

  // Fetch gift instantly rewards with infinite scroll
  const {
    data: rewardData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRewardGiftInstantlyInfinite({
    query: {
      size: 20,
      rewardCategoryId: categoryIdForApi,
    },
    options: {
      enabled: computed(() => activeCategoryId.value !== null),
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
  const rewards = computed<GiftInstantly[]>(() => {
    if (!rewardData.value?.pages) return []
    return rewardData.value.pages.flatMap(page => page.data ?? [])
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => rewardData.value?.pages?.length ?? 0)

  // Has data check
  const hasRewards = computed(() => rewards.value.length > 0)

  // Extract categories from API data to create filter tabs
  const categoryTabs = computed(() => {
    if (!categoriesData.value?.data) return []

    return categoriesData.value.data.map(category => ({
      key: String(category.id),
      label: category.label,
    }))
  })

  // Active filter key for ScrollablePillTabs (string-based v-model)
  const activeFilterKey = computed({
    get: () => (activeCategoryId.value !== null ? String(activeCategoryId.value) : ''),
    set: (value: string) => {
      activeCategoryId.value = value ? Number(value) : null
    },
  })

  // Helper to check if item is out of stock
  const isOutOfStock = (reward: GiftInstantly) => {
    if (!reward.quota || reward.quotaUsage === undefined) return false
    return reward.quotaUsage >= reward.quota
  }

  const handleCouponClick = (reward: GiftInstantly) => {
    router.push(`/rewards/catalog/${reward.id}`)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Filter Pills -->
    <template v-if="isCategoriesLoading">
      <div class="px-4 py-3">
        <ScrollablePillTabsSkeleton :count="4" />
      </div>
    </template>
    <template v-else>
      <ScrollablePillTabs v-model="activeFilterKey" :items="categoryTabs" class="px-4 py-3" />
    </template>

    <!-- Loading State -->
    <template v-if="isPending">
      <div class="px-4">
        <div class="grid grid-cols-2 gap-x-2 gap-y-3">
          <RewardCouponCardCompactSkeleton v-for="i in 6" :key="`skeleton-${i}`" />
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else-if="isError" class="flex flex-col items-center justify-center px-4 py-8">
      <EmptyState
        :image="RiwayatIllustration"
        title="Gagal memuat kupon"
        description="Terjadi kesalahan saat memuat kupon. Silakan coba lagi."
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasRewards" class="flex flex-col items-center justify-center px-4 py-8">
      <EmptyState
        :image="RiwayatIllustration"
        title="Voucher belum tersedia"
        description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
      />
    </div>

    <!-- Coupon Cards Grid -->
    <template v-else>
      <div class="px-4">
        <div class="grid grid-cols-2 gap-x-2 gap-y-3">
          <RewardCouponCardCompact
            v-for="reward in rewards"
            :key="reward.id"
            :title="reward.title"
            :image-url="reward.imageUrl"
            :points="reward.pricePoint"
            :button-label="isOutOfStock(reward) ? 'Habis' : 'Tukarkan Poin'"
            :flag-text="
              isOutOfStock(reward)
                ? 'Habis'
                : reward.stock
                  ? `Tersisa ${reward.stock} Voucher`
                  : undefined
            "
            :disabled="isOutOfStock(reward)"
            @button-click="handleCouponClick(reward)"
            @card-click="handleCouponClick(reward)"
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
      </div>
    </template>
  </div>
</template>
