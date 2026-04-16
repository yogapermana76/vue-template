<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { Clock } from 'lucide-vue-next'
  import { RewardBannerCard } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared/confirmation-bottom-sheet'
  import { useLotteryRedeemablePages } from '@/composables/services'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'

  const router = useRouter()

  // Fetch lottery redeemable pages
  const { data: lotteryPages } = useLotteryRedeemablePages({
    query: { page: 0, size: 10 },
  })

  // Debug: log data on change
  watch(lotteryPages, val => {
    // eslint-disable-next-line no-console
    console.log('Lottery Pages:', val)
  })

  const showConfirmationSheet = ref(false)
  const selectedDrawId = ref<string | null>(null)
  const selectedDrawPoints = ref(0)

  interface DrawItem {
    id: string
    title: string
    imageUrl: string
    points: number
    durationText: string
  }

  const drawData = ref<DrawItem[]>([
    {
      id: 'd1',
      title: 'Undian Loyalty Program Gelegar SwaCam',
      imageUrl: 'https://picsum.photos/343/264?random=31',
      points: 50,
      durationText: 'Mei - November 2026',
    },
    {
      id: 'd2',
      title: 'Undian Loyalty Program Gelegar SwaCam',
      imageUrl: 'https://picsum.photos/343/264?random=32',
      points: 50,
      durationText: 'Mei - November 2026',
    },
  ])

  const isSingleItem = computed(() => drawData.value.length === 1)

  const handleDrawClick = (id: string, points: number) => {
    selectedDrawId.value = id
    selectedDrawPoints.value = points
    showConfirmationSheet.value = true
  }

  const handleConfirmExchange = () => {
    showConfirmationSheet.value = false
    router.push('/rewards/redemption-details')
  }

  const handleCancelExchange = () => {
    showConfirmationSheet.value = false
    selectedDrawId.value = null
    selectedDrawPoints.value = 0
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="px-4">
      <h2 class="body-l-semibold text-slate-950">Ikuti Undiannya</h2>
    </div>

    <!-- Cards Container -->
    <div v-if="isSingleItem" class="px-4">
      <!-- Single Card - Full Width -->
      <RewardBannerCard
        :title="drawData[0].title"
        :image-url="drawData[0].imageUrl"
        :points="drawData[0].points"
        :duration-text="drawData[0].durationText"
        :duration-icon="Clock"
        button-label="Tukarkan Poin"
        @button-click="handleDrawClick(drawData[0].id, drawData[0].points)"
        @card-click="handleDrawClick(drawData[0].id, drawData[0].points)"
      />
    </div>

    <div
      v-else
      class="flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <!-- Multiple Cards - Horizontal Scroll -->
      <RewardBannerCard
        v-for="draw in drawData"
        :key="draw.id"
        :title="draw.title"
        :image-url="draw.imageUrl"
        :points="draw.points"
        :duration-text="draw.durationText"
        :duration-icon="Clock"
        button-label="Tukarkan Poin"
        class="w-85.75 shrink-0"
        @button-click="handleDrawClick(draw.id, draw.points)"
        @card-click="handleDrawClick(draw.id, draw.points)"
      />
    </div>

    <!-- Confirmation Bottom Sheet -->
    <ConfirmationBottomSheet
      v-model:open="showConfirmationSheet"
      :image="MascotIllustration"
      title="Menukarkan hadiah?"
      :description="`Apakah anda ingin menukarkan ${selectedDrawPoints} poin untuk mendapatkan hadiah ini?`"
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
