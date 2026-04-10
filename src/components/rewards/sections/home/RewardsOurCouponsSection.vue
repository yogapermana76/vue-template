<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { PillTab } from '@/components/ui/pill-tab'
  import { Button } from '@/components/ui/button'
  import { EmptyState } from '@/components/ui/empty-state'
  import { RewardCouponCard } from '@/components/rewards'
  import { ConfirmationBottomSheet } from '@/components/shared/confirmation-bottom-sheet'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'

  const router = useRouter()

  const showLocationSheet = ref(false)

  interface KuponItem {
    id: string
    title: string
    imageUrl: string
    points: number
    remaining?: number
  }

  const kuponData = ref<KuponItem[]>([
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

  const kuponFilters = [
    { key: 'all', label: 'Kupon Poin Kami' },
    { key: 'electricity', label: 'Voucher Listrik' },
    { key: 'ev', label: 'Voucher EV' },
    { key: 'other', label: 'Lainnya' },
  ]

  const activeFilter = ref('all')

  const filteredKupon = () => {
    if (activeFilter.value === 'all') return kuponData.value
    return kuponData.value.filter(k => {
      const filterKey = activeFilter.value
      if (filterKey === 'electricity') return k.title.includes('Listrik')
      if (filterKey === 'ev') return k.title.includes('EV')
      return false
    })
  }

  const handleKuponClick = () => {
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
    <div class="flex overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <PillTab
        v-for="filter in kuponFilters"
        :key="filter.key"
        :state="activeFilter === filter.key ? 'active' : 'default'"
        class="mr-2 shrink-0 last:mr-0"
        @click="activeFilter = filter.key"
      >
        {{ filter.label }}
      </PillTab>
    </div>

    <!-- Kupon Cards -->
    <div class="flex flex-col gap-4 px-4">
      <div v-for="kupon in filteredKupon()" :key="kupon.id" class="w-full">
        <RewardCouponCard
          :title="kupon.title"
          :image-url="kupon.imageUrl"
          :points="kupon.points"
          button-label="Tukar"
          :flag-text="kupon.remaining ? `Sisa: ${kupon.remaining}` : undefined"
          @button-click="handleKuponClick"
          @card-click="handleKuponClick"
        />
      </div>

      <EmptyState
        v-if="filteredKupon().length === 0"
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
