<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Header, Footer, GradientSection } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { RewardsRedemptionDetailsSection } from '@/components/rewards'
  import CheckIcon from '@/assets/illustrations/check.svg?component'

  definePage({
    meta: {
      title: 'Detail Penukaran',
    },
  })

  const router = useRouter()

  const handleDownloadInvoice = () => {
    // TODO: Implement download invoice
    console.log('Download invoice')
  }

  const handleBackToRewards = () => {
    router.push('/rewards')
  }
</script>

<template>
  <!-- Header -->
  <Header title="Detail Penukaran" positioning="fixed" transparent />

  <!-- Hero Section -->
  <GradientSection gradient="cyan" class="items-center pb-12">
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
  </GradientSection>

  <!-- Main Content -->
  <main class="flex flex-1 flex-col gap-5 pt-5 pb-36">
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
</template>
