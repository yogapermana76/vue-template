<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { ScrollablePillTabs, type PillTabItem } from '@/components/ui/pill-tab'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCardCompact } from '@/components/rewards'
  import { useRewardCategories, useRewardGiftInstantly } from '@/composables/services'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()

  // Fetch reward categories
  const { data: categoriesData } = useRewardCategories()

  // Fetch gift instantly rewards (will need to pass reward_category_id later)
  const { data: giftInstantlyData } = useRewardGiftInstantly({
    query: { page: 0, size: 5 },
  })

  // Debug: log data on change
  watch(categoriesData, val => {
    // eslint-disable-next-line no-console
    console.log('Categories Data:', val)
  })

  watch(giftInstantlyData, val => {
    // eslint-disable-next-line no-console
    console.log('Gift Instantly Data:', val)
  })

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
      title: 'Voucher Listrik Rp20.000',
      imageUrl: 'https://picsum.photos/343/171?random=21',
      points: 3500,
      remaining: 5,
    },
    {
      id: 'k2',
      title: 'Voucher Listrik Rp5.000',
      imageUrl: 'https://picsum.photos/343/171?random=22',
      points: 1000,
      remaining: 8,
    },
    {
      id: 'k3',
      title: 'Voucher EV Charging Rp50.000',
      imageUrl: 'https://picsum.photos/343/171?random=23',
      points: 8000,
      remaining: 3,
    },
    {
      id: 'k4',
      title: 'Voucher Listrik Rp10.000',
      imageUrl: 'https://picsum.photos/343/171?random=24',
      points: 2000,
      remaining: 0,
    },
    {
      id: 'k5',
      title: 'Voucher EV Charging Rp100.000',
      imageUrl: 'https://picsum.photos/343/171?random=25',
      points: 15000,
      remaining: 2,
    },
    {
      id: 'k6',
      title: 'Voucher Air Minum 5 Liter',
      imageUrl: 'https://picsum.photos/343/171?random=26',
      points: 500,
      remaining: 0,
    },
  ])

  // Helper to check if item is sold out
  const isSoldOut = (coupon: CouponItem) => coupon.remaining === 0

  const couponFilters: PillTabItem[] = [
    { key: 'all', label: 'Kupon Poin Kami' },
    { key: 'electricity', label: 'Voucher Listrik' },
    { key: 'ev', label: 'Voucher EV' },
    { key: 'other', label: 'Lainnya' },
  ]

  const activeFilter = ref('all')

  const filteredCoupons = () => {
    if (activeFilter.value === 'all') return couponData.value
    return couponData.value.filter(c => {
      const filterKey = activeFilter.value
      if (filterKey === 'electricity') return c.title.includes('Listrik')
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
    <!-- <h2 class="body-l-semibold px-4 text-slate-950">Semua Voucher</h2> -->

    <!-- Filter Pills -->
    <ScrollablePillTabs v-model="activeFilter" :items="couponFilters" class="px-4 py-3" />

    <!-- Coupon Cards Grid -->
    <div class="px-4">
      <div v-if="filteredCoupons().length > 0" class="grid grid-cols-2 gap-x-2 gap-y-3">
        <RewardCouponCardCompact
          v-for="coupon in filteredCoupons()"
          :key="coupon.id"
          :title="coupon.title"
          :image-url="coupon.imageUrl"
          :points="coupon.points"
          :button-label="isSoldOut(coupon) ? 'Habis' : 'Tukarkan Poin'"
          :flag-text="
            isSoldOut(coupon)
              ? 'Habis'
              : coupon.remaining
                ? `Tersisa ${coupon.remaining} Voucher`
                : undefined
          "
          :disabled="isSoldOut(coupon)"
          @button-click="handleCouponClick(coupon.id)"
          @card-click="handleCouponClick(coupon.id)"
        />
      </div>

      <EmptyState
        v-else
        :image="RiwayatIllustration"
        title="Voucher belum tersedia"
        description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
      />
    </div>
  </div>
</template>
