<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { Clock, CheckCircle2 } from 'lucide-vue-next'
  import { RewardBannerCard } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useUserLotteryList } from '@/composables/services'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()

  // Fetch user lottery list
  const { data: lotteryListData } = useUserLotteryList({
    query: { page: 0, size: 5 },
  })

  // Debug: log data on change
  watch(lotteryListData, val => {
    // eslint-disable-next-line no-console
    console.log('User Lottery List Data:', val)
  })

  // Lottery coupon item data
  interface LotteryCouponItem {
    id: string
    title: string
    imageUrl: string
    durationText: string
    status: 'active' | 'used' | 'expired'
    statusText?: string
    points?: number
  }

  const lotteryCouponData = ref<LotteryCouponItem[]>([
    {
      id: 'k1',
      title: 'Undian Loyalty Program Gelegar SwaCam',
      imageUrl: 'https://picsum.photos/343/264?random=4',
      durationText: 'Agustus - Oktober 2025',
      status: 'active',
      points: 50000,
    },
    {
      id: 'k2',
      title: 'Kupon Undian Gelegar PLN',
      imageUrl: 'https://picsum.photos/343/264?random=5',
      durationText: 'November - Desember 2025',
      status: 'active',
      points: 30000,
    },
    {
      id: 'k3',
      title: 'Kupon Undian Terbatas',
      imageUrl: 'https://picsum.photos/343/264?random=6',
      durationText: 'Januari - Maret 2026',
      status: 'used',
      statusText: 'Sudah Digunakan',
      points: 25000,
    },
  ])

  // Event handler
  const handleLotteryCouponClick = (id: string) => {
    router.push({
      path: `/rewards/my-rewards/${id}`,
      query: { type: 'lottery-coupon' },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-for="coupon in lotteryCouponData" :key="coupon.id" class="w-full">
      <RewardBannerCard
        :title="coupon.title"
        :image-url="coupon.imageUrl"
        :duration-text="coupon.durationText"
        :duration-icon="Clock"
        :status-text="coupon.statusText"
        :status-icon="coupon.status === 'used' ? CheckCircle2 : undefined"
        :points="coupon.points"
        :button-label="
          coupon.status === 'used'
            ? 'Sudah Digunakan'
            : coupon.status === 'expired'
              ? 'Kadaluarsa'
              : 'Ambil Hadiah'
        "
        @button-click="handleLotteryCouponClick(coupon.id)"
        @card-click="handleLotteryCouponClick(coupon.id)"
      />
    </div>

    <EmptyState
      v-if="lotteryCouponData.length === 0"
      :image="RiwayatIllustration"
      title="Kupon undian belum tersedia"
      description="Mohon maaf kupon undian sedang tidak tersedia untuk saat ini."
    />
  </div>
</template>
