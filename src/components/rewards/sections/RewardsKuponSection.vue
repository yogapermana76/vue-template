<script setup lang="ts">
  import { ref } from 'vue'
  import { Clock, CheckCircle2 } from 'lucide-vue-next'
  import { PillTab } from '@/components/ui/pill-tab'
  import { RewardBannerCard } from '@/components/rewards'

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

  // Lottery coupon filter options
  const lotteryCouponFilters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'expired', label: 'Expired' },
  ]

  const activeLotteryCouponFilter = ref('all')

  // Filter utility function
  const filteredLotteryCoupon = () => {
    if (activeLotteryCouponFilter.value === 'all') return lotteryCouponData.value
    if (activeLotteryCouponFilter.value === 'active')
      return lotteryCouponData.value.filter(k => k.status === 'active')
    if (activeLotteryCouponFilter.value === 'expired')
      return lotteryCouponData.value.filter(k => k.status === 'expired' || k.status === 'used')
    return lotteryCouponData.value
  }

  // Event handler
  const handleLotteryCouponClick = (id: string) => {
    console.log('Use lottery coupon:', id)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Filter Pills -->
    <div class="flex gap-2 overflow-x-auto px-4">
      <PillTab
        v-for="filter in lotteryCouponFilters"
        :key="filter.key"
        :state="activeLotteryCouponFilter === filter.key ? 'filter-active' : 'default'"
        @click="activeLotteryCouponFilter = filter.key"
      >
        {{ filter.label }}
      </PillTab>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4 px-4 pb-4">
      <div v-for="coupon in filteredLotteryCoupon()" :key="coupon.id" class="w-full">
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
        />
      </div>

      <div
        v-if="filteredLotteryCoupon().length === 0"
        class="flex items-center justify-center py-8"
      >
        <p class="body-m text-slate-600">Tidak ada kupon undian</p>
      </div>
    </div>
  </div>
</template>
