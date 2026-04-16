<script setup lang="ts">
  import { Header } from '@/components/layout'
  import { RewardsListCouponsSection } from '@/components/rewards'

  definePage({
    meta: {
      title: 'Voucher Rewards',
    },
  })
</script>

<template>
  <!-- Header -->
  <Header title="Voucher Rewards" positioning="sticky" />

  <!-- Hero Section with Featured Coupon -->
  <!-- <GradientSection gradient="blue-cyan">
    <RewardsListFeaturedSection />
  </GradientSection> -->

  <!-- Main Content -->
  <main class="flex flex-1 flex-col pb-6">
    <!-- Our Point Coupons Section -->
    <RewardsListCouponsSection />
  </main>
</template>
