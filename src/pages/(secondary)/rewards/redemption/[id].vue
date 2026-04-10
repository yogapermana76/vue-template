<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { RewardsRedemptionDetailsSection } from '@/components/rewards'
  import CheckIcon from '@/assets/illustrations/check.svg?component'

  definePage({
    meta: {
      title: 'Detail Penukaran',
    },
  })

  const router = useRouter()
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

  const handleDownloadInvoice = () => {
    // TODO: Implement download invoice
    console.log('Download invoice')
  }

  const handleBackToRewards = () => {
    router.push('/rewards')
  }
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white pb-36">
    <!-- Header -->
    <Header
      title="Detail Penukaran"
      positioning="fixed"
      :back-button-class="isScrolled ? 'text-neutral-950' : 'text-white'"
      :class="[
        'transition-all duration-300',
        isScrolled ? 'bg-white!' : 'bg-transparent!',
        isScrolled ? '[&_h1]:text-neutral-950' : '[&_h1]:text-white!',
      ]"
    />

    <!-- Hero Section -->
    <div
      class="bg-gradient-cyan relative flex w-full flex-col items-center overflow-hidden pt-16 pb-12"
    >
      <!-- Success Content Container -->
      <div class="flex flex-col items-center gap-4 px-4">
        <!-- Check Icon -->
        <div class="size-20 shrink-0">
          <CheckIcon class="size-full" />
        </div>

        <!-- Text Container -->
        <div class="flex flex-col items-center gap-1">
          <!-- Title -->
          <h1 class="heading-s text-center text-white">Penukaran Berhasil</h1>

          <!-- Subtitle -->
          <p class="body-m text-center text-white opacity-90">
            Penukaran yang anda lakukan telah berhasil
          </p>
        </div>
      </div>

      <!-- Rounded Overlap Shape -->
      <div class="absolute bottom-0 left-0 h-4 w-full rounded-t-md bg-white" />
    </div>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col gap-5 pt-5 pb-6">
      <RewardsRedemptionDetailsSection />
    </main>

    <!-- Footer with Buttons -->
    <Footer position="fixed">
      <Button variant="primary" size="md" class="w-full" @click="handleDownloadInvoice">
        Unduh Invoice
      </Button>
      <Button
        variant="secondary"
        size="md"
        class="border-primary-600/50 text-primary-700 w-full"
        @click="handleBackToRewards"
      >
        Kembali ke Rewards
      </Button>
    </Footer>
  </div>
</template>
