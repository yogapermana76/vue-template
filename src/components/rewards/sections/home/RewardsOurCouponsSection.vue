<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { ScrollablePillTabs, ScrollablePillTabsSkeleton } from '@/components/ui/pill-tab'
  import { Button } from '@/components/ui/button'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCardCompact, RewardCouponCardCompactSkeleton } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import {
    useRewardGiftInstantly,
    useRewardCategories,
    useLastAddress,
    useRewardExchange,
  } from '@/composables/services'
  import { useRewardsFilter } from '@/composables/ui'
  import { authStorage } from '@/utils/storage'
  import { formatNumber, extractApiError } from '@/utils'
  import { openDeeplink } from '@/utils/native-bridge'
  import type { GiftInstantly } from '@/types'
  import type { User } from '@/types/services/auth.types'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'
  import MascotIllustration from '@/assets/illustrations/mascot-confirm.png'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'
  import PensiveMascotIllustration from '@/assets/illustrations/pensive-mascot.svg?component'
  import DisappointedMascotIllustration from '@/assets/illustrations/disappointed-mascot.svg?component'

  const router = useRouter()
  const showConfirmationSheet = ref(false)
  const showAddressSheet = ref(false)
  const showErrorSheet = ref(false)
  const errorTitle = ref('')
  const errorDescription = ref('')
  const errorDeeplink = ref('')
  const selectedReward = ref<GiftInstantly | null>(null)

  // Get user profile from storage
  const userProfile = authStorage.getUser<User>()

  // Fetch last address for exchange
  const { data: lastAddressData } = useLastAddress()

  // Exchange mutation
  const { mutate: exchangeReward, isPending: isExchanging } = useRewardExchange()

  // Fetch reward categories for filter pills
  const { data: categoriesData, isPending: isCategoriesLoading } = useRewardCategories()

  // Filter state management with session persistence
  const { activeCategoryId, categoryIdForApi, initializeWithDefault } = useRewardsFilter()

  // Get first category ID as default filter
  const defaultCategoryId = computed(() => categoriesData.value?.data?.[0]?.id ?? null)

  // Initialize filter with default category when categories load
  watch(
    defaultCategoryId,
    newDefaultId => {
      initializeWithDefault(newDefaultId)
    },
    { immediate: true },
  )

  // Fetch gift instantly rewards based on selected category
  // Only enabled when categoryId is available to prevent unnecessary API calls
  const {
    data: rewardData,
    isPending,
    isError,
  } = useRewardGiftInstantly({
    query: {
      page: 0,
      size: 4,
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
    // Show address sheet for ITEM type, confirmation sheet for others
    if (reward.type === 'ITEM') {
      showAddressSheet.value = true
    } else {
      showConfirmationSheet.value = true
    }
  }

  const handleConfirmExchange = () => {
    if (!selectedReward.value) return

    // Reset error state before submission
    errorTitle.value = ''
    errorDescription.value = ''
    // Don't close confirmation sheet - keep it open until mutation completes

    const address = lastAddressData.value?.data
    const rewardId = Number(selectedReward.value.id)
    const isItemType = selectedReward.value.type === 'ITEM'

    // For non-ITEM types, send empty values for address fields (user might not have last address)
    // For ITEM types, use actual address data
    const addressData =
      isItemType && address
        ? {
            provinceId: address.provinceId,
            provinceName: address.provinceName,
            cityId: address.cityId,
            cityName: address.cityName,
            districtId: address.districtId,
            districtName: address.districtName,
            address: address.address,
            postalCode: address.postalCode,
          }
        : {
            provinceId: 0,
            provinceName: '',
            cityId: 0,
            cityName: '',
            districtId: 0,
            districtName: '',
            address: '',
            postalCode: '',
          }

    exchangeReward(
      {
        rewardId,
        ...addressData,
        receivedInfo: {
          fullname: userProfile?.fullname || '',
          email: userProfile?.email || '',
          noHp: userProfile?.phoneNumber || '',
        },
      },
      {
        onSuccess: response => {
          // Only close sheet on success
          showConfirmationSheet.value = false
          const redemptionId = response.data?.id
          if (redemptionId) {
            router.push(`/rewards/redemption/${redemptionId}`)
          }
        },
        onError: (error: unknown) => {
          showConfirmationSheet.value = false
          const { title, description, deeplink, hasData } = extractApiError(
            error,
            'Gagal Menukar Hadiah',
          )
          // Only show error sheet if response has valid error data structure
          if (!hasData) return
          errorTitle.value = title
          errorDescription.value = description
          errorDeeplink.value = deeplink || ''
          showErrorSheet.value = true
        },
      },
    )
  }

  const handleCancelExchange = () => {
    showConfirmationSheet.value = false
    selectedReward.value = null
  }

  const handleConfirmAddress = () => {
    showAddressSheet.value = false
    if (selectedReward.value) {
      router.push({
        path: '/rewards/complete-address',
        query: { id: String(selectedReward.value.id), type: 'reward' },
      })
    }
  }

  const handleViewAllClick = () => {
    router.push('/rewards/list')
  }

  // Computed for confirmation description
  const confirmationDescription = computed(() => {
    if (!selectedReward.value) return ''
    return `Apakah anda ingin menukarkan <strong>${formatNumber(selectedReward.value.pricePoint)} poin</strong> untuk mendapatkan voucher ini?`
  })

  // Error illustration based on error title
  const errorIllustration = computed(() => {
    if (errorTitle.value === 'Ups, hadiah sudah habis') {
      return DisappointedMascotIllustration
    }
    return PensiveMascotIllustration
  })

  // Handle email verification redirect
  const handleVerifyEmail = () => {
    if (errorDeeplink.value) {
      openDeeplink(errorDeeplink.value)
    }
    showErrorSheet.value = false
  }

  // Close error sheet handler
  const handleCloseError = (): void => {
    showErrorSheet.value = false
  }

  // Lowercase error title for case-insensitive comparison
  const errorTitleLower = computed(() => errorTitle.value.toLowerCase())

  // Verification error titles to button labels map
  const verificationLabels: Record<string, string> = {
    'verifikasi email dulu, yuk!': 'Verifikasi Email',
    'verifikasi nomor hp dulu, yuk!': 'Verifikasi Nomor HP',
    'verifikasi akun dulu, yuk!': 'Verifikasi Akun',
  }

  // Dynamic error bottom sheet buttons
  const errorSheetButtons = computed(() => {
    const verificationLabel = verificationLabels[errorTitleLower.value]

    if (verificationLabel) {
      return [
        {
          label: verificationLabel,
          variant: 'primary' as const,
          onClick: handleVerifyEmail,
        },
        {
          label: 'Tutup',
          variant: 'secondary' as const,
          onClick: handleCloseError,
        },
      ]
    }

    return [
      {
        label: 'Kembali',
        variant: 'primary' as const,
        onClick: handleCloseError,
      },
    ]
  })
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header with View All Button -->
    <div class="flex items-center justify-between px-4">
      <h2 class="body-l-semibold text-slate-950">Tukarkan Poin Kamu</h2>
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
          loading: isExchanging,
          onClick: handleConfirmExchange,
        },
      ]"
    />

    <!-- Location Confirmation Bottom Sheet (for ITEM type) -->
    <ConfirmationBottomSheet
      v-model:open="showAddressSheet"
      :image="LocationIllustration"
      title="Alamat belum lengkap"
      description="Lengkapi dahulu alamat anda agar kami mudah dalam mengirim hadiah untuk anda."
      button-layout="column"
      :buttons="[
        {
          label: 'Lengkapi alamat',
          variant: 'primary',
          onClick: handleConfirmAddress,
        },
      ]"
    />

    <!-- Error Bottom Sheet -->
    <ConfirmationBottomSheet
      v-model:open="showErrorSheet"
      :image="errorIllustration"
      :title="errorTitle"
      :description="errorDescription"
      :button-layout="'column'"
      :buttons="errorSheetButtons"
    />
  </div>
</template>
