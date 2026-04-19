<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { ScrollablePillTabs, ScrollablePillTabsSkeleton } from '@/components/ui/pill-tab'
  import { Button } from '@/components/ui/button'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCardCompact, RewardCouponCardCompactSkeleton } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import { useRewardGiftInstantly, useRewardCategories } from '@/composables/services'
  import type { GiftInstantly } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'

  const router = useRouter()
  const showConfirmationSheet = ref(false)
  const selectedReward = ref<GiftInstantly | null>(null)

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

  // Fetch gift instantly rewards based on selected category
  // Only enabled when categoryId is available to prevent unnecessary API calls
  const {
    data: rewardData,
    isPending,
    isError,
  } = useRewardGiftInstantly({
    query: {
      page: 0,
      size: 10,
      rewardCategoryId: categoryIdForApi,
    },
    options: {
      enabled: computed(() => activeCategoryId.value !== null),
    },
  })

  // Use API data directly without unnecessary transformation
  const rewards = computed(() => rewardData.value?.data?.data ?? [])

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

  const handleCardClick = (reward: GiftInstantly) => {
    router.push(`/rewards/catalog/${reward.id}`)
  }

  const handleButtonClick = (reward: GiftInstantly) => {
    selectedReward.value = reward
    showConfirmationSheet.value = true
  }

  const handleConfirmExchange = () => {
    showConfirmationSheet.value = false
    if (selectedReward.value) {
      router.push(`/rewards/redemption/${selectedReward.value.id}`)
    }
  }

  const handleCancelExchange = () => {
    showConfirmationSheet.value = false
    selectedReward.value = null
  }

  const handleViewAllClick = () => {
    router.push('/rewards/list')
  }

  // Computed for confirmation description
  const confirmationDescription = computed(() => {
    if (!selectedReward.value) return ''
    return `Apakah anda ingin menukarkan ${selectedReward.value.pricePoint} poin untuk mendapatkan voucher ini?`
  })
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header with View All Button -->
    <div class="flex items-center justify-between px-4">
      <h2 class="body-l-semibold text-slate-950">Kupon Poin Kami</h2>
      <Button
        variant="tertiary"
        size="sm"
        class="text-primary-700 h-auto w-auto p-0"
        @click="handleViewAllClick"
      >
        Lihat Semua
      </Button>
    </div>

    <!-- Filter Pills -->
    <template v-if="isCategoriesLoading">
      <div class="px-4">
        <ScrollablePillTabsSkeleton :count="4" />
      </div>
    </template>
    <template v-else>
      <ScrollablePillTabs v-model="activeFilterKey" :items="categoryTabs" class="px-4" />
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
    <template v-else-if="!hasRewards">
      <div class="px-4">
        <EmptyState
          :image="RiwayatIllustration"
          title="Voucher belum tersedia"
          description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
        />
      </div>
    </template>

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
            button-label="Tukarkan Poin"
            :flag-text="reward.stock ? `Tersisa ${reward.stock} Voucher` : undefined"
            @button-click="handleButtonClick(reward)"
            @card-click="handleCardClick(reward)"
          />
        </div>
      </div>
    </template>

    <!-- Confirmation Bottom Sheet -->
    <ConfirmationBottomSheet
      v-model:open="showConfirmationSheet"
      :image="MascotIllustration"
      title="Menukarkan hadiah?"
      :description="confirmationDescription"
      button-layout="row"
      :buttons="[
        {
          label: 'Kembali',
          variant: 'secondary',
          onClick: handleCancelExchange,
        },
        {
          label: 'Tukar Poin',
          variant: 'primary',
          onClick: handleConfirmExchange,
        },
      ]"
    />
  </div>
</template>
