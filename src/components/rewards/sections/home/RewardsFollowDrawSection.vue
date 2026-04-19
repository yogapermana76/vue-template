<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { Clock } from 'lucide-vue-next'
  import { RewardBannerCard, RewardBannerCardSkeleton } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useLotteryRedeemablePages } from '@/composables/services'
  import { formatDateRange } from '@/utils/date'
  import type { Lottery } from '@/types'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()
  const showLocationSheet = ref(false)
  const selectedLottery = ref<Lottery | null>(null)

  const {
    data: lotteryPages,
    isPending,
    isError,
  } = useLotteryRedeemablePages({
    query: { page: 0, size: 10 },
  })

  const lotteries = computed(() => lotteryPages.value?.data?.data ?? [])
  const isSingleItem = computed(() => lotteries.value.length === 1)

  const getDurationText = (lottery: Lottery) => {
    if (!lottery.startDate || !lottery.endDate) return 'Segera hadir'
    return formatDateRange(lottery.startDate, lottery.endDate) || 'Segera hadir'
  }

  const handleCardClick = (lottery: Lottery) => {
    router.push(`/rewards/lottery/${lottery.id}`)
  }

  const handleButtonClick = (lottery: Lottery) => {
    selectedLottery.value = lottery
    showLocationSheet.value = true
  }

  const handleCompleteAddress = () => {
    showLocationSheet.value = false
    if (selectedLottery.value) {
      router.push({
        path: '/rewards/complete-address',
        query: { lotteryId: selectedLottery.value.id },
      })
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="px-4">
      <h2 class="body-l-semibold text-slate-950">Ikuti Undiannya</h2>
    </div>

    <!-- Loading State -->
    <div
      v-if="isPending"
      class="flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <RewardBannerCardSkeleton v-for="i in 3" :key="`skeleton-${i}`" class="w-85.75 shrink-0" />
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex flex-col items-center justify-center px-4 py-8">
      <EmptyState
        :image="RiwayatIllustration"
        title="Gagal memuat undian"
        description="Terjadi kesalahan saat memuat data undian. Silakan coba lagi."
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="lotteries.length === 0"
      class="flex flex-col items-center justify-center px-4 py-8"
    >
      <EmptyState
        :image="RiwayatIllustration"
        title="Belum ada undian"
        description="Undian belum tersedia saat ini."
      />
    </div>

    <!-- Single Card - Full Width -->
    <div v-else-if="isSingleItem" class="px-4">
      <RewardBannerCard
        :title="lotteries[0].title"
        :image-url="lotteries[0].imageUrl"
        :points="lotteries[0].pricePoint"
        :duration-text="getDurationText(lotteries[0])"
        :duration-icon="Clock"
        button-label="Tukarkan Poin"
        @button-click="handleButtonClick(lotteries[0])"
        @card-click="handleCardClick(lotteries[0])"
      />
    </div>

    <!-- Multiple Cards - Horizontal Scroll -->
    <div
      v-else
      class="flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <RewardBannerCard
        v-for="lottery in lotteries"
        :key="lottery.id"
        :title="lottery.title"
        :image-url="lottery.imageUrl"
        :points="lottery.pricePoint"
        :duration-text="getDurationText(lottery)"
        :duration-icon="Clock"
        button-label="Tukarkan Poin"
        class="w-85.75 shrink-0"
        @button-click="handleButtonClick(lottery)"
        @card-click="handleCardClick(lottery)"
      />
    </div>
  </div>

  <!-- Location Confirmation Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showLocationSheet"
    :image="LocationIllustration"
    title="Alamat belum lengkap"
    description="Lengkapi dahulu alamat anda agar kami mudah dalam mengirim hadiah untuk anda."
    button-layout="column"
    :buttons="[
      {
        label: 'Lengkapi alamat',
        variant: 'primary',
        onClick: handleCompleteAddress,
      },
    ]"
  />
</template>
