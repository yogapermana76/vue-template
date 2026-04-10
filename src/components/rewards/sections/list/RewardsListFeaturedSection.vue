<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { RewardCouponCard } from '@/components/rewards'
  import { Clock } from 'lucide-vue-next'

  const router = useRouter()

  // Featured coupon
  const featuredCoupon = {
    id: 'featured-1',
    title: 'Gelegar FUN MOBILE 2025 - Special Hadiah 9.9',
    imageUrl: 'https://picsum.photos/343/264?random=4',
    flagText: 'Tersisa 5 Voucher',
    flagIcon: 'ticket' as const,
    statusText: 'Hingga 31/12/2025',
    statusIcon: Clock,
    points: 3500,
  }

  const handleFeaturedClick = () => {
    router.push(`/rewards/${featuredCoupon.id}`)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <h2 class="body-l-semibold px-4 text-white">Paling cocok untukmu</h2>

    <!-- Featured Coupon Card -->
    <div class="px-4 pb-4">
      <RewardCouponCard
        :title="featuredCoupon.title"
        :image-url="featuredCoupon.imageUrl"
        :flag-text="featuredCoupon.flagText"
        :flag-icon="featuredCoupon.flagIcon"
        :status-text="featuredCoupon.statusText"
        :status-icon="featuredCoupon.statusIcon"
        :points="featuredCoupon.points"
        :ellipse-color="'#12cbe4'"
        button-label="Ambil Hadiah"
        @button-click="handleFeaturedClick"
        @card-click="handleFeaturedClick"
      />
    </div>
  </div>
</template>
