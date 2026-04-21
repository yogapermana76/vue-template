<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Check, Clock } from 'lucide-vue-next'
  import {
    ScrollablePillTabs,
    ScrollablePillTabsSkeleton,
    type PillTabItem,
  } from '@/components/ui/pill-tab'
  import {
    RewardCouponCard,
    RewardCouponCardSkeleton,
    VoucherCodesBottomSheet,
  } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import {
    useVoucherPagesInfinite,
    useVoucherCategories,
    useVoucherCategoryFilter,
  } from '@/composables/services'
  import type { Voucher } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'
  import { formatDate } from '@/utils/date'

  const router = useRouter()
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Fetch voucher categories
  const { data: categoriesData, isPending: isCategoriesPending } = useVoucherCategories()

  // Use shared category filter state
  const { categoryIdForApi, activeFilterKey } = useVoucherCategoryFilter()

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

  // Codenames that require showing voucher code in bottomsheet
  const voucherCodeSheetCodenames = ['general_voucher_code', 'ultra_voucher', 'raw_voucher']

  // State for voucher code bottomsheet
  const showVoucherCodeSheet = ref(false)
  const selectedVoucherData = ref<Voucher | null>(null)

  // Handle card click - navigate without voucherCode
  // const handleVoucherCardClick = (voucherId: number) => {
  //   router.push({
  //     path: `/rewards/my-rewards/${voucherId}`,
  //     query: { type: 'voucher' },
  //   })
  // }

  // Handle button click - check codename to decide action
  const handleVoucherCardClick = (voucher: Voucher) => {
    if (voucherCodeSheetCodenames.includes(voucher.codename)) {
      // Show bottomsheet for voucher code display
      selectedVoucherData.value = voucher
      showVoucherCodeSheet.value = true
    } else {
      // Navigate to detail page for other types
      router.push({
        path: `/rewards/my-rewards/${voucher.voucherId}`,
        query: { type: 'voucher' },
      })
    }
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
            button-label="Lihat Detail"
            :stock-text="
              voucher.availableQuota > 1 ? `${voucher.availableQuota} Voucher` : undefined
            "
            stock-variant="secondary"
            :status-text="`Hingga ${formatDate(voucher.expiredDate, 'dd/MM/yyyy')}`"
            :status-icon="Clock"
            @button-click="handleVoucherCardClick(voucher)"
            @card-click="handleVoucherCardClick(voucher)"
          >
            <template #footer>
              <div class="flex flex-1 items-center gap-1">
                <Check class="size-4 shrink-0 text-teal-600" :stroke-width="4" />
                <span class="body-caption-medium text-teal-700"> Voucher dimiliki </span>
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

      <EmptyState
        v-else
        :image="RiwayatIllustration"
        title="Voucher belum tersedia"
        description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
      />
    </div>

    <!-- Voucher Codes Bottom Sheet (for general_voucher_code, ultra_voucher, raw_voucher) -->
    <VoucherCodesBottomSheet
      v-if="selectedVoucherData"
      v-model:open="showVoucherCodeSheet"
      :voucher-id="selectedVoucherData.voucherId"
      :title="selectedVoucherData.title"
    />
  </div>
</template>
