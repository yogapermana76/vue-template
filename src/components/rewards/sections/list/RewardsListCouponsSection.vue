<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { PillTab } from '@/components/ui/pill-tab'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCard } from '@/components/rewards'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()

  interface CouponItem {
    id: string
    title: string
    imageUrl: string
    points: number
    remaining?: number
  }

  const couponData = ref<CouponItem[]>([
    {
      id: 'k1',
      title: 'Electricity Voucher Rp20.000',
      imageUrl: 'https://picsum.photos/343/171?random=21',
      points: 3500,
      remaining: 5,
    },
    {
      id: 'k2',
      title: 'Electricity Voucher Rp5.000',
      imageUrl: 'https://picsum.photos/343/171?random=22',
      points: 1000,
    },
    {
      id: 'k3',
      title: 'EV Charging Voucher Rp50.000',
      imageUrl: 'https://picsum.photos/343/171?random=23',
      points: 8000,
      remaining: 3,
    },
    {
      id: 'k4',
      title: 'Electricity Voucher Rp10.000',
      imageUrl: 'https://picsum.photos/343/171?random=24',
      points: 2000,
      remaining: 0,
    },
    {
      id: 'k5',
      title: 'EV Charging Voucher Rp100.000',
      imageUrl: 'https://picsum.photos/343/171?random=25',
      points: 15000,
      remaining: 2,
    },
  ])

  // Helper to check if item is sold out
  const isSoldOut = (coupon: CouponItem) => coupon.remaining === 0

  const couponFilters = [
    { key: 'all', label: 'Our Point Coupons' },
    { key: 'electricity', label: 'Electricity Voucher' },
    { key: 'ev', label: 'EV Voucher' },
    { key: 'other', label: 'Others' },
  ]

  const activeFilter = ref('all')

  const filteredCoupons = () => {
    if (activeFilter.value === 'all') return couponData.value
    return couponData.value.filter(c => {
      const filterKey = activeFilter.value
      if (filterKey === 'electricity') return c.title.includes('Electricity')
      if (filterKey === 'ev') return c.title.includes('EV')
      return false
    })
  }

  const handleCouponClick = (id: string) => {
    router.push(`/rewards/${id}`)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <h2 class="body-l-semibold px-4 text-slate-950">Semua Voucher</h2>

    <!-- Filter Pills -->
    <div
      class="flex overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <PillTab
        v-for="filter in couponFilters"
        :key="filter.key"
        :state="activeFilter === filter.key ? 'active' : 'default'"
        class="mr-2 shrink-0 last:mr-0"
        @click="activeFilter = filter.key"
      >
        {{ filter.label }}
      </PillTab>
    </div>

    <!-- Coupon Cards -->
    <div class="flex flex-col gap-4 px-4">
      <div v-for="coupon in filteredCoupons()" :key="coupon.id" class="w-full">
        <RewardCouponCard
          :title="coupon.title"
          :image-url="coupon.imageUrl"
          :points="coupon.points"
          :button-label="isSoldOut(coupon) ? 'Tukarkan Poin' : 'Redeem'"
          :flag-text="
            isSoldOut(coupon)
              ? 'Habis'
              : coupon.remaining
                ? `Remaining: ${coupon.remaining}`
                : undefined
          "
          :flag-variant="isSoldOut(coupon) ? 'danger' : 'success'"
          :disabled="isSoldOut(coupon)"
          @button-click="handleCouponClick(coupon.id)"
          @card-click="handleCouponClick(coupon.id)"
        />
      </div>

      <EmptyState
        v-if="filteredCoupons().length === 0"
        :image="RiwayatIllustration"
        title="Vouchers not available"
        description="Sorry, vouchers are not available at the moment."
      />
    </div>
  </div>
</template>
