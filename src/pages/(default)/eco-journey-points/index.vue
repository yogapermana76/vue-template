<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header } from '@/components/layout'
  import { RoundedOverlap } from '@/components/ui'
  import { FloatingScanButton } from '@/components/ui/button'
  import {
    EcoJourneyInfoSection,
    EcoJourneyRedemptionSection,
    EcoJourneyMoreSection,
  } from '@/components/eco-journey-points'

  definePage({
    meta: {
      title: 'Eco Journey Points',
    },
  })

  const router = useRouter()
  const isScrolled = ref(false)
  const showButton = ref(true)
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50

    // Hide button when scrolling, show when scroll stops
    showButton.value = false

    // Clear previous timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // Show button again after scroll stops (600ms without scroll event)
    scrollTimeout = setTimeout(() => {
      showButton.value = true
    }, 800)
  }

  const backButtonClass = computed(() => (isScrolled.value ? 'text-neutral-950' : 'text-white'))

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
    <Header
      positioning="fixed"
      :back-button-class="backButtonClass"
      :class="['transition-all duration-300', isScrolled ? 'bg-white!' : 'bg-transparent!']"
    />

    <!-- Hero Section -->
    <div class="bg-gradient-navy relative flex w-full flex-col overflow-hidden pt-16 pb-5">
      <!-- Info Section -->
      <EcoJourneyInfoSection />

      <!-- Rounded Overlap Shape -->
      <RoundedOverlap />
    </div>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col gap-6">
      <!-- Event Description Section -->
      <div class="flex flex-col gap-1 px-4">
        <h2 class="body-l-semibold text-neutral-950">Judul Event</h2>
        <p class="text-xs text-slate-700">
          Lorem ipsum dolor sit amet consectetur. Diam aliquet purus sed viverra gravida etiam. Ut
          vitae sagittis risus a in. Integer odio tellus sed aliquam viverra tempus sit volutpat.
          Enim cursus feugiat enim faucibus. Diam netus amet vitae etiam nisl. Sed ullamcorper proin
          purus vitae eget mi. Vitae non luctus laoreet integer dictumst nulla sed. Eget ullamcorper
          auctor est eleifend neque interdum donec sit magnis. Etiam purus purus purus tristique
          semper nam.
        </p>
      </div>

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
