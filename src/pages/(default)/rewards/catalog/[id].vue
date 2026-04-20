<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Package, Ticket } from 'lucide-vue-next'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import {
    RewardProgramInfo,
    RewardTermsSection,
    RewardDetailSkeleton,
  } from '@/components/rewards/sections'
  import {
    useRewardRedeemableDetail,
    usePointSummary,
    useLastAddress,
    useRewardExchange,
  } from '@/composables/services'
  import { authStorage } from '@/utils/storage'
  import { formatNumber } from '@/utils'
  import type { User } from '@/types/services/auth.types'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  definePage({
    meta: {
      title: 'Detail',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const showConfirmationSheet = ref(false)
  const showAddressSheet = ref(false)

  // Get user profile from storage
  const userProfile = authStorage.getUser<User>()

  // Get ID from route params
  const rewardId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })

  // Fetch reward detail
  const { data: rewardDetail, isPending } = useRewardRedeemableDetail({
    params: { id: rewardId },
  })

  // Fetch user points
  const { data: userPointsData } = usePointSummary()

  // Fetch last address for exchange
  const { data: lastAddressData } = useLastAddress()

  // Exchange mutation
  const { mutate: exchangeReward } = useRewardExchange()

  const reward = computed(() => rewardDetail.value?.data)
  const userPoints = computed(() => userPointsData.value?.data?.balance ?? 0)

  // Check if user has enough points
  const hasEnoughPoints = computed(() => {
    if (!reward.value) return false
    return userPoints.value >= reward.value.pricePoint
  })

  // Check if quota is available
  const hasQuota = computed(() => {
    if (!reward.value) return true
    if (reward.value.remainingQuota === undefined) return true
    return reward.value.remainingQuota > 0
  })

  // Check if user can exchange
  const canExchange = computed(() => {
    if (!reward.value) return false
    return reward.value.canExchanged === true && hasEnoughPoints.value && hasQuota.value
  })

  // Program info
  const programInfo = computed(() => {
    if (!reward.value) return { title: '', description: '' }
    return {
      title: reward.value.title,
      description: reward.value.description,
    }
  })

  // Stats
  const stats = computed(() => {
    if (!reward.value) return []

    const statsArray = []
    const isItem = reward.value.type === 'ITEM'
    const unit = isItem ? 'Unit' : 'Voucher'

    // Stock/Quota
    if (reward.value.remainingQuota !== undefined) {
      statsArray.push({
        id: 'stock',
        label: isItem ? 'Stok Tersisa' : 'Sisa Voucher',
        value: `${reward.value.remainingQuota} ${unit}`,
        icon: isItem ? Package : Ticket,
      })
    }

    // Points
    statsArray.push({
      id: 'points',
      label: 'Poin yang dibutuhkan',
      value: `${formatNumber(reward.value.pricePoint)} Poin`,
      icon: CoinIcon,
    })

    // Max per person
    if (reward.value.addRules?.reward_max) {
      statsArray.push({
        id: 'max',
        label: `Maksimal per ${reward.value.addRules.reward_max.type}`,
        value: `${reward.value.addRules.reward_max.qty} ${unit}`,
        icon: Package,
      })
    }

    return statsArray
  })

  // Terms items - includes both "Cara Penggunaan" and "Syarat dan Ketentuan"
  const termsItems = computed(() => {
    if (!reward.value) return []

    const items = []

    // Add "Cara Penggunaan" if howToUse exists
    if (reward.value.howToUse && reward.value.howToUse.length > 0) {
      const howToUseSteps = reward.value.howToUse.map(step => `<li>${step}</li>`).join('')

      items.push({
        id: 'how-to-use',
        title: 'Cara Penggunaan',
        content: `<ol style="list-style-type: decimal; padding-left: 1.25rem;">${howToUseSteps}</ol>`,
      })
    }

    // Add "Syarat dan Ketentuan" from termsCondition
    if (reward.value.termsCondition && reward.value.termsCondition.length > 0) {
      // Combine all terms into single content
      const allTermsContent = reward.value.termsCondition
        .map(term => {
          return `<p class="body-caption-semibold text-slate-950 mb-2">${term.label}</p>${term.value}`
        })
        .join('<div class="mt-4"></div>') // Add spacing between multiple terms

      items.push({
        id: 'terms-and-conditions',
        title: 'Syarat dan Ketentuan',
        content: allTermsContent,
      })
    }

    return items
  })

  const handleExchangeClick = () => {
    if (reward.value?.type === 'ITEM') {
      showAddressSheet.value = true
    } else {
      showConfirmationSheet.value = true
    }
  }

  const handleCancelExchange = () => {
    showConfirmationSheet.value = false
  }

  const handleConfirmExchange = () => {
    if (!lastAddressData.value?.data) return

    const address = lastAddressData.value.data

    exchangeReward(
      {
        rewardId: Number(rewardId.value),
        provinceId: address.provinceId,
        provinceName: address.provinceName,
        cityId: address.cityId,
        cityName: address.cityName,
        districtId: address.districtId,
        districtName: address.districtName,
        address: address.address,
        postalCode: address.postalCode,
        receivedInfo: {
          fullname: userProfile?.fullname || '',
          email: userProfile?.email || '',
          noHp: userProfile?.phoneNumber || '',
        },
      },
      {
        onSuccess: response => {
          showConfirmationSheet.value = false
          const redemptionId = response.data?.id
          if (redemptionId) {
            router.push(`/rewards/redemption/${redemptionId}`)
          }
        },
      },
    )
  }

  const handleConfirmAddress = () => {
    showAddressSheet.value = false
    router.push({
      path: '/rewards/complete-address',
      query: { id: rewardId.value, type: 'reward' },
    })
  }

  // Footer message for disabled state
  const disabledMessage = computed(() => {
    if (!reward.value) return null
    if (!hasQuota.value) return 'Kuota Voucher sudah habis'
    if (!hasEnoughPoints.value) return 'Poin anda tidak mencukupi'
    return null
  })

  // Confirmation description
  const confirmationDescription = computed(() => {
    if (!reward.value) return ''
    return `Apakah anda ingin menukarkan <strong>${formatNumber(reward.value.pricePoint)} poin</strong> untuk mendapatkan hadiah ini?`
  })
</script>

<template>
  <!-- Header -->
  <Header title="Detail" positioning="sticky" />

  <!-- Loading State -->
  <template v-if="isPending">
    <RewardDetailSkeleton />
  </template>

  <!-- Loaded State -->
  <template v-else>
    <!-- Hero Banner Section -->
    <HeroBanner v-if="reward" :src="reward.imageUrl" />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
      <!-- Program Info Section -->
      <RewardProgramInfo :program-info="programInfo" :stats="stats" />

      <!-- Terms & Conditions Section -->
      <RewardTermsSection v-if="termsItems.length > 0" :items="termsItems" />
    </main>
  </template>

  <!-- Footer with Button -->
  <Footer position="fixed">
    <!-- Disabled state message -->
    <div v-if="disabledMessage">
      <p class="body-m text-slate-950">{{ disabledMessage }}</p>
    </div>

    <!-- Enabled state with points display -->
    <div v-if="canExchange && reward" class="flex w-full items-center justify-between gap-2">
      <p class="body-m flex-1 text-slate-950">Tukar dengan</p>
      <p class="body-l-semibold text-primary-700 flex-1 text-right">
        {{ formatNumber(reward.pricePoint) }} poin
      </p>
    </div>

    <!-- Button -->
    <Button
      :variant="canExchange ? 'primary' : 'secondary'"
      size="sm"
      class="w-full"
      :disabled="!canExchange"
      @click="handleExchangeClick"
    >
      Tukar Poin
    </Button>
  </Footer>

  <!-- Exchange Confirmation Bottom Sheet -->
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
</template>
