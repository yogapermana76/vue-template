<script setup lang="ts">
  import { Header, GradientSection } from '@/components/layout'
  import { RewardsListFeaturedSection, RewardsListCouponsSection } from '@/components/rewards'

  definePage({
    meta: {
      title: 'Voucher Rewards',
    },
  })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header title="Voucher Rewards" positioning="fixed" transparent />

    <!-- Hero Section with Featured Coupon -->
    <GradientSection gradient="blue-cyan">
      <RewardsListFeaturedSection />
    </GradientSection>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col pb-6">
      <!-- Our Point Coupons Section -->
      <RewardsListCouponsSection />
    </main>
  </div>
</template>
