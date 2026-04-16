<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { Header, GradientSection } from '@/components/layout'
  import { WinnerCard, type WinnerData } from '@/components/rewards'
  import { InformationBottomSheet } from '@/components/shared'
  import { useWinnerListInfinite } from '@/composables/services'
  import { config } from '@/config'
  import { AlertCircle } from 'lucide-vue-next'

  definePage({
    meta: {
      title: 'Pemenang',
    },
  })

  // State
  const isInfoOpen = ref(false)

  // Fetch winners data with infinite scroll
  const { data: winnersData } = useWinnerListInfinite({
    query: {
      size: 10,
      timingCategory: 'MONTHLY',
      lotteryId: 52,
    },
  })

  // Debug: log data on change
  watch(winnersData, val => {
    // eslint-disable-next-line no-console
    console.log('Winners Data:', val)
  })

  // Data
  const periodLabel = 'Pemenang Undian Periode Januari - Maret 2025'

  interface WinnerItem {
    rank: number
    prize: string
    winner: WinnerData
    prizeImage: string
  }

  // Featured winners (rank 1-3)
  const featuredWinners: WinnerItem[] = [
    {
      rank: 1,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Subeni',
        email: 'lisxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
      prizeImage: 'https://picsum.photos/56/56?random=1',
    },
    {
      rank: 2,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Busra',
        email: 'busxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
      prizeImage: 'https://picsum.photos/56/56?random=2',
    },
    {
      rank: 3,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Elthon J Huwae',
        email: 'eltxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
      prizeImage: 'https://picsum.photos/56/56?random=3',
    },
  ]

  // Other winners (rank 4+)
  const otherWinners: WinnerItem[] = [
    {
      rank: 4,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Lisa Apryani',
        email: 'lisxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
      prizeImage: 'https://picsum.photos/56/56?random=4',
    },
    {
      rank: 5,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Faidil Bujang',
        email: 'fasxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
      prizeImage: 'https://picsum.photos/56/56?random=5',
    },
    {
      rank: 6,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Elthon J Huwae',
        email: 'eltxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
      prizeImage: 'https://picsum.photos/56/56?random=6',
    },
  ]

  // Current user card (fixed at bottom)
  const currentUserCard: WinnerItem = {
    rank: 100,
    prize: 'Mobil Listrik',
    winner: {
      name: 'Anda',
      email: 'eltxxxx@gmail.com',
      phone: '628533333xxxx',
    },
    prizeImage: 'https://picsum.photos/56/56?random=user',
  }

  // Fixed card style with container width constraint
  const fixedCardStyle = computed(() => ({
    maxWidth: `${config.ui.maxWidth}px`,
  }))
</script>

<template>
  <!-- Header -->
  <Header title="Pemenang" positioning="fixed" transparent>
    <template #actions="{ isDarkBg, iconClass }">
      <IconButton
        variant="tertiary"
        :class="['-mr-2', iconClass]"
        :is-dark-bg="isDarkBg"
        @click="isInfoOpen = true"
      >
        <AlertCircle />
      </IconButton>
    </template>
  </Header>

  <!-- Hero Section with Featured Winners -->
  <GradientSection gradient="teal" class="pt-14">
    <!-- Period Badge -->
    <div class="z-10 flex justify-center px-4 pb-3">
      <div
        class="flex flex-row items-center justify-between gap-1 rounded-full bg-slate-800/30 px-4 py-2 backdrop-blur-md"
      >
        <span class="body-caption-semibold flex-1 text-center text-white">
          {{ periodLabel }}
        </span>
      </div>
    </div>

    <!-- Featured Winners (Rank 1-3) -->
    <div class="z-10 flex flex-col gap-2 px-4 pb-8">
      <WinnerCard
        v-for="item in featuredWinners"
        :key="item.rank"
        :rank="item.rank"
        :prize="item.prize"
        :winner="item.winner"
        :prize-image="item.prizeImage"
        :show-rank-icon="true"
      />
    </div>
  </GradientSection>

  <!-- Other Winners (Rank 4+) -->
  <main class="flex flex-1 flex-col gap-2 px-4 pb-32">
    <WinnerCard
      v-for="item in otherWinners"
      :key="item.rank"
      :rank="item.rank"
      :prize="item.prize"
      :winner="item.winner"
      :prize-image="item.prizeImage"
    />
  </main>

  <!-- Fixed Current User Card at Bottom -->
  <div class="fixed inset-x-0 bottom-0 z-40 mx-auto" :style="fixedCardStyle">
    <WinnerCard
      :rank="currentUserCard.rank"
      :prize="currentUserCard.prize"
      :winner="currentUserCard.winner"
      :prize-image="currentUserCard.prizeImage"
      variant="featured"
      :highlighted-content="true"
      class="rounded-b-none"
      content-class="rounded-b-none"
    />
  </div>

  <!-- Information BottomSheet -->
  <InformationBottomSheet
    v-model:open="isInfoOpen"
    title="Informasi"
    description="Daftar pemenang undian Anda dapat dilihat di halaman ini. Setiap periode undian memiliki pemenang berbeda berdasarkan hasil pengundian yang fair dan transparan."
  />
</template>
