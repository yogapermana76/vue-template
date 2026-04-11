<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header, GradientSection } from '@/components/layout'
  import { FloatingScanButton } from '@/components/ui/button'
  import {
    EcoJourneyInfoSection,
    EcoJourneyRedemptionSection,
    EcoJourneyMoreSection,
    EcoJourneyDescriptionSection,
  } from '@/components/eco-journey-points'

  definePage({
    meta: {
      title: 'Eco Journey Points',
    },
  })

  const router = useRouter()
  const showButton = ref(true)
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null

  const handleScroll = () => {
    // Hide button when scrolling, show when scroll stops
    showButton.value = false

    // Clear previous timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // Show button again after scroll stops (800ms without scroll event)
    scrollTimeout = setTimeout(() => {
      showButton.value = true
    }, 800)
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const handleScan = () => {
    // TODO: Implement QR code scanning (temporary: navigate to check-in page)
    router.push('/eco-journey-points/check-in')
  }
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header positioning="fixed" transparent />

    <!-- Hero Section -->
    <GradientSection gradient="navy">
      <EcoJourneyInfoSection />
    </GradientSection>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col gap-6">
      <!-- Event Description Section -->
      <EcoJourneyDescriptionSection />

      <!-- Redemption Section -->
      <EcoJourneyRedemptionSection />

      <!-- More Section -->
      <EcoJourneyMoreSection />
    </main>

    <!-- Floating Scan Button -->
    <Transition enter-active-class="animate-bounce-up" leave-active-class="animate-bounce-down">
      <FloatingScanButton v-if="showButton" label="Scan QR" @click="handleScan" />
    </Transition>
  </div>
</template>
