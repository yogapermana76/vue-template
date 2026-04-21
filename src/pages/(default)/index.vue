<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useQueryClient } from '@tanstack/vue-query'
  import { Header, GradientSection } from '@/components/layout'
  import {
    RewardsFaqSection,
    RewardsInfoSection,
    RewardsOurCouponsSection,
    RewardsAlertSection,
    RewardsFollowDrawSection,
    RewardsHowToSection,
  } from '@/components/rewards'
  import { IconButton } from '@/components/ui/button'
  import { PullToRefresh } from '@/components/shared'
  import HistoryIcon from '@/assets/icons/history.svg?component'
  import { usePullToRefresh } from '@/composables/ui'
  import {
    rewardKeys,
    lotteryKeys,
    pointKeys,
    winnerKeys,
    publicKeys,
  } from '@/composables/services'

  definePage({
    meta: {
      title: 'Rewards',
    },
  })

  const router = useRouter()
  const queryClient = useQueryClient()

  const handleNavigateToHistory = () => {
    router.push('/rewards/history')
  }

  // Pull to refresh - invalidate specific queries for home page sections
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await Promise.all([
        // RewardsInfoSection
        queryClient.invalidateQueries({ queryKey: pointKeys.summary() }),
        queryClient.invalidateQueries({ queryKey: winnerKeys.categories() }),
        // RewardsAlertSection
        queryClient.invalidateQueries({ queryKey: rewardKeys.verifyInfo() }),
        // RewardsFollowDrawSection
        queryClient.invalidateQueries({ queryKey: lotteryKeys.redeemablePages() }),
        // RewardsOurCouponsSection
        queryClient.invalidateQueries({ queryKey: rewardKeys.categories() }),
        queryClient.invalidateQueries({ queryKey: rewardKeys.giftInstantly() }),
        queryClient.invalidateQueries({ queryKey: rewardKeys.lastAddress() }),
        // RewardsHowToSection
        queryClient.invalidateQueries({ queryKey: publicKeys.fyi() }),
        // RewardsFaqSection
        queryClient.invalidateQueries({ queryKey: publicKeys.faq() }),
      ])
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <!-- Header -->
  <Header title="Rewards" :show-back="false" positioning="fixed" transparent>
    <template #actions="{ isDarkBg, iconClass }">
      <IconButton
        variant="tertiary"
        :class="['-mr-2 [&_svg]:size-[unset]!', iconClass]"
        :is-dark-bg="isDarkBg"
        @click="handleNavigateToHistory"
      >
        <HistoryIcon />
      </IconButton>
    </template>
  </Header>

  <!-- Hero Section -->
  <GradientSection gradient="navy" show-ellipse-glow>
    <RewardsInfoSection />
  </GradientSection>

  <!-- Main Content -->
  <main class="flex flex-1 flex-col gap-6">
    <!-- Alert Section -->
    <RewardsAlertSection />

    <!-- Follow Draw Section -->
    <RewardsFollowDrawSection />

    <!-- Our Coupons Section -->
    <RewardsOurCouponsSection />

    <!-- How To Section -->
    <RewardsHowToSection />

    <!-- FAQ Section -->
    <RewardsFaqSection />
  </main>
</template>
