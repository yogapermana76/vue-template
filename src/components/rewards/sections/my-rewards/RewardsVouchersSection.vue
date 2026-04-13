<script setup lang="ts">
  import { ref } from 'vue'
  import { ScrollablePillTabs, type PillTabItem } from '@/components/ui/pill-tab'
  import { RewardCouponCard } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  // Voucher item data
  interface VoucherItem {
    id: string
    title: string
    imageUrl: string
    points: number
    remaining?: number
  }

  const voucherData = ref<VoucherItem[]>([
    {
      id: 'v1',
      title: 'Voucher Listrik Rp20.000',
      imageUrl: 'https://picsum.photos/343/171?random=1',
      points: 3500,
      remaining: 5,
    },
    {
      id: 'v2',
      title: 'Voucher Listrik Rp5.000',
      imageUrl: 'https://picsum.photos/343/171?random=2',
      points: 1000,
    },
    {
      id: 'v3',
      title: 'Voucher EV Charging Rp50.000',
      imageUrl: 'https://picsum.photos/343/171?random=3',
      points: 8000,
      remaining: 3,
    },
  ])

  // Voucher filter options
  const voucherFilters: PillTabItem[] = [
    { key: 'all', label: 'All' },
    { key: 'electricity-voucher', label: 'Electricity Voucher' },
    { key: 'ev-voucher', label: 'EV Voucher' },
    { key: 'other-voucher', label: 'Other Voucher' },
  ]

  const activeVoucherFilter = ref('all')

  // Filter utility function
  const filteredVoucher = () => {
    if (activeVoucherFilter.value === 'all') return voucherData.value
    return voucherData.value.filter(v => {
      const filterKey = activeVoucherFilter.value
      if (filterKey === 'electricity-voucher') return v.title.includes('Listrik')
      if (filterKey === 'ev-voucher') return v.title.includes('EV')
      return false
    })
  }

  // Event handler
  const handleVoucherClick = (id: string) => {
    console.log('Redeem voucher:', id)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Filter Pills -->
    <ScrollablePillTabs
      v-model="activeVoucherFilter"
      :items="voucherFilters"
      class="sticky top-0 z-10 bg-white px-4 py-4"
    />

    <!-- Content -->
    <div class="flex flex-col gap-4 px-4 pb-4">
      <div v-for="voucher in filteredVoucher()" :key="voucher.id" class="w-full">
        <RewardCouponCard
          :title="voucher.title"
          :image-url="voucher.imageUrl"
          :points="voucher.points"
          button-label="Redeem Voucher"
          :flag-text="voucher.remaining ? `Remaining: ${voucher.remaining}` : undefined"
          :on-button-click="() => handleVoucherClick(voucher.id)"
        />
      </div>

      <EmptyState
        v-if="filteredVoucher().length === 0"
        :image="RiwayatIllustration"
        title="Voucher belum tersedia"
        description="Mohon maaf voucher sedang tidak tersedia untuk saat ini."
      />
    </div>
  </div>
</template>
