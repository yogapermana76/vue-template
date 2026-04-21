<script setup lang="ts">
  import { useQueryClient } from '@tanstack/vue-query'
  import { Header } from '@/components/layout'
  import { RewardsListCouponsSection } from '@/components/rewards'
  import { PullToRefresh } from '@/components/shared'
  import { usePullToRefresh } from '@/composables/ui'
  import { rewardKeys } from '@/composables/services'

  definePage({
    meta: {
      title: 'Voucher Rewards',
    },
  })

  const queryClient = useQueryClient()

  // Pull to refresh - invalidate specific queries for this page
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: rewardKeys.categories() }),
        queryClient.invalidateQueries({ queryKey: rewardKeys.giftInstantly() }),
        queryClient.invalidateQueries({ queryKey: rewardKeys.lastAddress() }),
      ])
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

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
