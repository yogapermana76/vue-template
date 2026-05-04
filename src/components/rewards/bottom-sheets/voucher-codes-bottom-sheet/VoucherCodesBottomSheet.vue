<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Check, Clock } from 'lucide-vue-next'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { RewardCouponCard, RewardCouponCardSkeleton } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { InfiniteScrollTrigger } from '@/components/ui/infinite-scroll-trigger'
  import { useVoucherDetailsPagesInfinite } from '@/composables/services'
  import type { VoucherCodeDetail } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/history.png'
  import { formatDate } from '@/utils/date'

  interface Props {
    open: boolean
    voucherId: number
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Kode Voucher',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const router = useRouter()
  const loadMoreRef = ref<HTMLElement | null>(null)

  // Fetch voucher codes with infinite scroll
  // Only enabled when bottomsheet is open
  const {
    data: voucherCodesData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVoucherDetailsPagesInfinite({
    query: {
      size: 10,
      voucherId: computed(() => props.voucherId),
    },
    options: {
      enabled: computed(() => props.open),
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
  const voucherCodesList = computed<VoucherCodeDetail[]>(() => {
    if (!voucherCodesData.value?.pages) return []
    return voucherCodesData.value.pages.flatMap(page => page.data ?? [])
  })

  // Get current page count for infinite scroll trigger
  const currentPageCount = computed(() => voucherCodesData.value?.pages?.length ?? 0)

  // Handle card click - navigate to voucher detail
  const handleCardClick = (voucherCode: VoucherCodeDetail) => {
    emit('update:open', false)
    router.push({
      path: `/rewards/my-rewards/${voucherCode.voucherId}`,
      query: { type: 'voucher', voucherCode: voucherCode.voucherCode },
    })
  }
</script>

<template>
  <BottomSheet :open="open" :title="title" @update:open="emit('update:open', $event)">
    <div class="flex flex-col gap-4">
      <!-- Loading Skeleton -->
      <template v-if="isPending">
        <RewardCouponCardSkeleton v-for="i in 3" :key="`skeleton-${i}`" />
      </template>

      <!-- Error State -->
      <EmptyState
        v-else-if="isError"
        :image="RiwayatIllustration"
        title="Gagal memuat voucher"
        description="Terjadi kesalahan saat memuat voucher. Silakan coba lagi."
      />

      <!-- Content -->
      <template v-else-if="voucherCodesList.length > 0">
        <div v-for="voucherCode in voucherCodesList" :key="voucherCode.id" class="w-full">
          <RewardCouponCard
            :title="voucherCode.title"
            :image-url="voucherCode.imageUrl"
            button-label="Lihat Detail"
            :status-text="`Hingga ${formatDate(voucherCode.expiredDate, 'dd/MM/yyyy')}`"
            :status-icon="Clock"
            @button-click="handleCardClick(voucherCode)"
            @card-click="handleCardClick(voucherCode)"
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

      <!-- Empty State -->
      <EmptyState
        v-else
        :image="RiwayatIllustration"
        title="Kode voucher belum tersedia"
        description="Mohon maaf kode voucher sedang tidak tersedia untuk saat ini."
      />
    </div>
  </BottomSheet>
</template>
