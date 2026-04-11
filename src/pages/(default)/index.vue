<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Header, GradientSection } from '@/components/layout'
  import {
    RewardsFaqSection,
    RewardsInfoSection,
    RewardsOurCouponsSection,
    RewardsAlertSection,
    RewardsFollowDrawSection,
  } from '@/components/rewards'
  import { History } from 'lucide-vue-next'

  definePage({
    meta: {
      title: 'Rewards',
    },
  })

  const router = useRouter()

  const handleNavigateToHistory = () => {
    router.push('/rewards/history')
  }
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header title="Rewards" :show-back="false" positioning="fixed" transparent>
      <template #actions="{ isDarkBg, iconClass }">
        <IconButton
          variant="tertiary"
          :class="['-mr-2', iconClass]"
          :is-dark-bg="isDarkBg"
          @click="handleNavigateToHistory"
        >
          <History />
        </IconButton>
      </template>
    </Header>

    <!-- Hero Section -->
    <GradientSection gradient="navy">
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

      <!-- FAQ Section -->
      <RewardsFaqSection />
    </main>
  </div>
</template>
