<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import {
    ScrollablePillTabs,
    ScrollablePillTabsSkeleton,
    type PillTabItem,
  } from '@/components/ui/pill-tab'
  import { RewardCouponCard, RewardCouponCardSkeleton } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { useVoucherPagesInfinite, useVoucherCategories } from '@/composables/services'
  import type { Voucher } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Fetch voucher categories
  const { data: categoriesData, isPending: isCategoriesPending } = useVoucherCategories()

  // Get first enabled category ID as default, or null for "Semua"
  const defaultCategoryId = computed(() => {
    // Return null to show "Semua" as default (no filter)
    return null
  })

  const activeCategoryId = ref<number | null>(null)

  // Set default category when categories load
  watch(
    defaultCategoryId,
    newDefaultId => {
      if (newDefaultId !== null && activeCategoryId.value === null) {
        activeCategoryId.value = newDefaultId
      }
    },
    { immediate: true },
  )

  // Convert null to undefined for API call (MaybeRef<number | undefined>)
  const categoryIdForApi = computed(() => activeCategoryId.value ?? undefined)

  // Fetch user vouchers with infinite scroll
  const {
    data: vouchersData,
    isPending: isVouchersPending,
    isError: isVouchersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVoucherPagesInfinite({
    query: {
      size: 10,
      categoryId: categoryIdForApi,
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
  const voucherList = computed<Voucher[]>(() => {
    if (!vouchersData.value?.pages) return []
    return vouchersData.value.pages.flatMap(page => page.data ?? [])
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => vouchersData.value?.pages?.length ?? 0)

  // Extract categories from API data to create filter tabs
  const voucherFilters = computed<PillTabItem[]>(() => {
    const categories = categoriesData.value?.data ?? []
    const pills: PillTabItem[] = [{ key: 'all', label: 'Semua' }]

    if (Array.isArray(categories)) {
      categories
        .filter(category => category.enable)
        .sort((a, b) => a.sort - b.sort)
        .forEach(category => {
          pills.push({
            key: String(category.id),
            label: category.title,
          })
        })
    }

    return pills
  })

  // Active filter key for ScrollablePillTabs (string-based v-model)
  const activeFilterKey = computed({
    get: () => (activeCategoryId.value !== null ? String(activeCategoryId.value) : 'all'),
    set: (value: string) => {
      activeCategoryId.value = value === 'all' ? null : Number(value)
    },
  })

  const handleVoucherClick = (voucherId: string) => {
    router.push({
      path: `/rewards/my-rewards/${voucherId}`,
      query: { type: 'voucher' },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Filter Pills -->
    <template v-if="isCategoriesPending">
      <div class="px-4 py-3">
        <ScrollablePillTabsSkeleton :count="4" />
      </div>
    </template>
    <template v-else>
      <ScrollablePillTabs
        v-model="activeFilterKey"
        :items="voucherFilters"
        class="sticky top-0 z-10 bg-white px-4 py-4"
      />
    </template>

    <!-- Loading Skeleton -->
    <div v-if="isVouchersPending" class="flex flex-col gap-4 px-4 pb-4">
      <RewardCouponCardSkeleton v-for="i in 3" :key="`skeleton-${i}`" />
    </div>

    <!-- Error State -->
    <div v-else-if="isVouchersError" class="px-4 pb-4">
      <EmptyState
        :image="RiwayatIllustration"
        title="Gagal memuat voucher"
        description="Terjadi kesalahan saat memuat voucher. Silakan coba lagi."
      />
    </div>

    <!-- Content -->
    <div v-else class="flex flex-col gap-4 px-4 pb-4">
      <template v-if="voucherList.length > 0">
        <div v-for="voucher in voucherList" :key="voucher.id" class="w-full">
          <RewardCouponCard
            :title="voucher.title"
            :image-url="voucher.imageUrl"
            :points="0"
            button-label="Lihat Detail"
            :flag-text="
              voucher.availableQuota > 0 ? `Tersisa ${voucher.availableQuota}` : undefined
            "
            @button-click="handleVoucherClick(voucher.voucherId.toString())"
            @card-click="handleVoucherClick(voucher.voucherId.toString())"
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

      <EmptyState
        v-else
        :image="RiwayatIllustration"
        title="Voucher belum tersedia"
        description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
      />
    </div>
  </div>
</template>
