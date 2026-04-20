<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Ticket, Calendar } from 'lucide-vue-next'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import {
    RewardProgramInfo,
    RewardTermsSection,
    RewardDetailSkeleton,
  } from '@/components/rewards/sections'
  import { useUserLotteryDetail, usePointSummary } from '@/composables/services'
  import { formatDate } from '@/utils/date'
  import { formatNumber } from '@/utils'
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

  // Get ID from route params
  const lotteryId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })

  // Fetch lottery detail
  const { data: lotteryDetail, isPending } = useUserLotteryDetail({
    params: { id: lotteryId },
  })

  // Fetch user points
  const { data: userPointsData } = usePointSummary()

  const lottery = computed(() => lotteryDetail.value?.data)
  const userPoints = computed(() => userPointsData.value?.data?.balance ?? 0)

  // Program info
  const programInfo = computed(() => {
    if (!lottery.value) return { title: '', description: '' }
    return {
      title: lottery.value.title,
      description: lottery.value.description,
    }
  })

  // Stats
  const stats = computed(() => {
    if (!lottery.value) return []

    const statsArray = []

    // Coupon count
    if (lottery.value.redeemCount !== undefined) {
      statsArray.push({
        id: 'coupon',
        label: 'Sisa Kupon',
        value: `${lottery.value.redeemCount} Kupon`,
        icon: Ticket,
      })
    }

    // Period
    if (lottery.value.startDate && lottery.value.endDate) {
      const startMonth = formatDate(lottery.value.startDate, 'MMMM')
      const endMonth = formatDate(lottery.value.endDate, 'MMMM yyyy')
      statsArray.push({
        id: 'period',
        label: 'Periode Promo',
        value: `${startMonth} - ${endMonth}`,
        icon: Calendar,
      })
    }

    // Points
    if (lottery.value.pricePoint !== undefined) {
      statsArray.push({
        id: 'points',
        label: 'Poin yang ditukar',
        value: `${formatNumber(lottery.value.pricePoint)} Poin`,
        icon: CoinIcon,
      })
    }

    return statsArray
  })

  // Terms items - Single "Syarat dan Ketentuan" accordion containing all terms
  const termsItems = computed(() => {
    if (!lottery.value?.termsCondition || lottery.value.termsCondition.length === 0) return []

    // Combine all terms into single content
    const allTermsContent = lottery.value.termsCondition
      .map(term => {
        return `<p class="body-caption-semibold text-slate-950 mb-2">${term.label}</p>${term.value}`
      })
      .join('<div class="mt-4"></div>') // Add spacing between multiple terms

    return [
      {
        id: 'terms-and-conditions',
        title: 'Syarat dan Ketentuan',
        content: allTermsContent,
      },
    ]
  })

  // Check if user has enough points
  const hasEnoughPoints = computed(() => {
    if (!lottery.value?.pricePoint) return true
    return userPoints.value >= lottery.value.pricePoint
  })

  // Check if user can exchange
  const canExchange = computed(() => {
    if (!lottery.value) return false
    return hasEnoughPoints.value
  })

  // Disabled message for footer
  const disabledMessage = computed(() => {
    if (!lottery.value) return null
    if (!hasEnoughPoints.value) return 'Poin anda tidak mencukupi'
    return null
  })

  const handleExchangeClick = () => {
    showConfirmationSheet.value = true
  }

  const handleConfirmExchange = () => {
    showConfirmationSheet.value = false
    router.push({
      path: '/rewards/complete-address',
      query: { id: lotteryId.value, type: 'lottery' },
    })
  }
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
    <HeroBanner v-if="lottery" :src="lottery.imageUrl" />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
      <!-- Program Info Section -->
      <RewardProgramInfo :program-info="programInfo" :stats="stats" />

      <!-- Terms & Conditions Section -->
      <RewardTermsSection v-if="termsItems.length > 0" :items="termsItems" />
    </main>

    <!-- Footer with Button -->
    <Footer position="fixed">
      <!-- Disabled state message -->
      <div v-if="disabledMessage">
        <p class="body-m text-slate-950">{{ disabledMessage }}</p>
      </div>

      <!-- Enabled state with points display -->
      <div v-if="canExchange && lottery" class="flex w-full items-center justify-between gap-2">
        <p class="body-m text-slate-950">Tukar dengan</p>
        <p class="body-l-semibold text-primary-700">
          {{ formatNumber(lottery.pricePoint ?? 0) }} poin
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
  </template>

  <!-- Location Confirmation Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showConfirmationSheet"
    :image="LocationIllustration"
    title="Alamat belum lengkap"
    description="Lengkapi dahulu alamat anda agar kami mudah dalam mengirim hadiah untuk anda."
    button-layout="column"
    :buttons="[
      {
        label: 'Lengkapi alamat',
        variant: 'primary',
        onClick: handleConfirmExchange,
      },
    ]"
  />
</template>
