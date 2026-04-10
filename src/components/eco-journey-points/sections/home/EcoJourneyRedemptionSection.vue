<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCard } from '@/components/rewards'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()

  interface RedemptionItem {
    id: string
    title: string
    imageUrl: string
    points: number
    remaining?: number
  }

  const redemptionData = ref<RedemptionItem[]>([
    {
      id: 'r1',
      title: 'Voucher Listrik Rp20.000',
      imageUrl: 'https://picsum.photos/343/171?random=21',
      points: 3500,
      remaining: 5,
    },
    {
      id: 'r2',
      title: 'Voucher Listrik Rp5.000',
      imageUrl: 'https://picsum.photos/343/171?random=22',
      points: 1000,
    },
    {
      id: 'r3',
      title: 'Voucher EV Charging Rp50.000',
      imageUrl: 'https://picsum.photos/343/171?random=23',
      points: 8000,
      remaining: 3,
    },
  ])

  const handleCardClick = (itemId: string) => {
    router.push(`/eco-journey-points/${itemId}`)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="px-4">
      <h2 class="body-l-semibold text-slate-950">Tukar Hadiah</h2>
    </div>

    <!-- Redemption Cards -->
    <div class="flex flex-col gap-4 px-4">
      <div v-for="item in redemptionData" :key="item.id" class="w-full">
        <RewardCouponCard
          :title="item.title"
          :image-url="item.imageUrl"
          :points="item.points"
          button-label="Tukar Hadiah"
          :flag-text="item.remaining ? `Sisa: ${item.remaining}` : undefined"
          @card-click="handleCardClick(item.id)"
        />
      </div>

      <EmptyState
        v-if="redemptionData.length === 0"
        :image="RiwayatIllustration"
        title="Hadiah belum tersedia"
        description="Mohon maaf hadiah sedang tidak tersedia untuk saat ini."
      />
    </div>
  </div>
</template>
