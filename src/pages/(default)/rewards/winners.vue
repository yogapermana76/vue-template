<script setup lang="ts">
  import { Header, GradientSection } from '@/components/layout'
  import { WinnerCard, type WinnerData } from '@/components/rewards'

  definePage({
    meta: {
      title: 'Pemenang',
    },
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
</script>

<template>
  <!-- Header -->
  <Header title="Pemenang" positioning="fixed" transparent />

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
      />
    </div>
  </GradientSection>

  <!-- Other Winners (Rank 4+) -->
  <main class="flex flex-1 flex-col gap-2 px-4 pb-6">
    <WinnerCard
      v-for="item in otherWinners"
      :key="item.rank"
      :rank="item.rank"
      :prize="item.prize"
      :winner="item.winner"
      :prize-image="item.prizeImage"
    />
  </main>
</template>
