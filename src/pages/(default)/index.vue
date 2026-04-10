<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header } from '@/components/layout'
  import { RoundedOverlap } from '@/components/ui'
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
  const isScrolled = ref(false)

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }

  const handleNavigateToHistory = () => {
    router.push('/rewards/history')
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header
      title="Rewards"
      :show-back="false"
      positioning="fixed"
      :class="[
        'transition-all duration-300',
        isScrolled ? 'bg-white!' : 'bg-transparent!',
        isScrolled ? '[&_h1]:text-neutral-950' : '[&_h1]:text-white!',
      ]"
    >
      <template #actions>
        <IconButton
          variant="tertiary"
          class="-mr-2"
          :class="[isScrolled ? 'text-neutral-950' : 'text-white']"
          @click="handleNavigateToHistory"
        >
          <History />
        </IconButton>
      </template>
    </Header>

    <!-- Hero Section -->
    <div class="bg-gradient-navy relative flex w-full flex-col overflow-hidden pt-16 pb-5">
      <!-- Rewards Info Section -->
      <RewardsInfoSection />

      <!-- Rounded Overlap Shape -->
      <RoundedOverlap />
    </div>

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
