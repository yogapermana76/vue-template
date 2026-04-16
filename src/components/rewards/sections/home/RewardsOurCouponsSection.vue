<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { ScrollablePillTabs, type PillTabItem } from '@/components/ui/pill-tab'
  import { Button } from '@/components/ui/button'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCardCompact } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared/confirmation-bottom-sheet'
  import { useRewardCategories, useRewardGiftInstantly } from '@/composables/services'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'

  const router = useRouter()

  const showLocationSheet = ref(false)

  // Fetch reward categories
  const { data: categoriesData } = useRewardCategories()

  // Fetch gift instantly rewards
  const { data: giftInstantly } = useRewardGiftInstantly({
    query: { page: 0, size: 10 },
  })

  // Debug: log data on change
  watch(categoriesData, val => {
    // eslint-disable-next-line no-console
    console.log('Categories Data:', val)
  })

  watch(giftInstantly, val => {
    // eslint-disable-next-line no-console
    console.log('Gift Instantly:', val)
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
    },
    {
      id: 'k3',
      title: 'Voucher EV Charging Rp50.000',
      imageUrl: 'https://picsum.photos/343/171?random=23',
      points: 8000,
      remaining: 3,
    },
  ])

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

  const handleCouponClick = () => {
    showLocationSheet.value = true
  }

  const handleCompleteAddress = () => {
    showLocationSheet.value = false
    router.push('/rewards/complete-address')
  }

  const handleViewAllClick = () => {
    router.push('/rewards/list')
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header with View All Button -->
    <div class="flex items-center justify-between px-4">
      <h2 class="body-l-semibold text-slate-950">Kupon Poin Kami</h2>
      <Button
        variant="tertiary"
        size="sm"
        class="text-primary-700 h-auto w-auto p-0"
        @click="handleViewAllClick"
      >
        Lihat Semua
      </Button>
    </div>

    <!-- Filter Pills -->
    <ScrollablePillTabs v-model="activeFilter" :items="couponFilters" class="px-4" />

    <!-- Coupon Cards Grid -->
    <div class="px-4">
      <div v-if="filteredCoupons().length > 0" class="grid grid-cols-2 gap-x-2 gap-y-3">
        <RewardCouponCardCompact
          v-for="coupon in filteredCoupons()"
          :key="coupon.id"
          :title="coupon.title"
          :image-url="coupon.imageUrl"
          :points="coupon.points"
          button-label="Tukarkan Poin"
          :flag-text="coupon.remaining ? `Tersisa ${coupon.remaining} Voucher` : undefined"
          @button-click="handleCouponClick"
          @card-click="handleCouponClick"
        />
      </div>

      <EmptyState
        v-else
        :image="RiwayatIllustration"
        title="Voucher belum tersedia"
        description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
      />
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
  </div>
</template>
