<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Header, GradientSection } from '@/components/layout'
  import { RewardsListFeaturedSection, RewardsListCouponsSection } from '@/components/rewards'

  definePage({
    meta: {
      title: 'Voucher Rewards',
    },
  })

  const isScrolled = ref(false)

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
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
      title="Voucher Rewards"
      positioning="fixed"
      :back-button-class="isScrolled ? 'text-neutral-950' : 'text-white'"
      :class="[
        'transition-all duration-300',
        isScrolled ? 'bg-white!' : 'bg-transparent!',
        isScrolled ? '[&_h1]:text-neutral-950' : '[&_h1]:text-white!',
      ]"
    />

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
