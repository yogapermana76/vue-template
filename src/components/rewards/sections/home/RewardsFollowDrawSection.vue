<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { Clock } from 'lucide-vue-next'
  import { RewardBannerCard } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import { useLotteryRedeemablePages } from '@/composables/services'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'

  const router = useRouter()
  const showLocationSheet = ref(false)
  const selectedDrawId = ref<string | null>(null)

  // Fetch lottery redeemable pages
  const { data: lotteryPages } = useLotteryRedeemablePages({
    query: { page: 0, size: 10 },
  })

  // Debug: log data on change
  watch(lotteryPages, val => {
    // eslint-disable-next-line no-console
    console.log('Lottery Pages:', val)
  })

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

  const handleCardClick = (id: string) => {
    router.push(`/rewards/lottery/${id}`)
  }

  const handleButtonClick = (id: string) => {
    selectedDrawId.value = id
    showLocationSheet.value = true
  }

  const handleCompleteAddress = () => {
    showLocationSheet.value = false
    if (selectedDrawId.value) {
      router.push('/rewards/complete-address')
    }
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
        @button-click="handleButtonClick(drawData[0].id)"
        @card-click="handleCardClick(drawData[0].id)"
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
        @button-click="handleButtonClick(draw.id)"
        @card-click="handleCardClick(draw.id)"
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
