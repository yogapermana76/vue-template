<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { ConfirmationBottomSheet } from '@/components/shared/confirmation-bottom-sheet'
  import { EcoJourneyHeroBanner } from '@/components/eco-journey-points/sections'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'

  definePage({
    meta: {
      title: 'Check In',
    },
  })

  const router = useRouter()
  const showConfirmationSheet = ref(false)

  const handleCheckInClick = () => {
    showConfirmationSheet.value = true
  }

  const handleConfirmCheckIn = () => {
    showConfirmationSheet.value = false
    router.push('/eco-journey-points')
  }

  const handleCancelCheckIn = () => {
    showConfirmationSheet.value = false
  }
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header positioning="sticky" />

    <!-- Hero Banner Section -->
    <EcoJourneyHeroBanner />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
      <!-- Title & Description Section -->
      <section class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <h1 class="heading-s text-slate-950">Judul Event</h1>
          <p class="body-caption text-slate-600">
            Lorem ipsum dolor sit amet consectetur. Diam aliquet purus sed viverra gravida etiam. Ut
            vitae sagittis risus a in. Integer odio tellus sed aliquam viverra tempus sit volutpat.
            Enim cursus feugiat enim faucibus. Diam netus amet vitae etiam nisl. Sed ullamcorper
            proin purus vitae eget mi. Vitae non luctus laoreet integer dictumst nulla sed. Eget
            ullamcorper auctor est eleifend neque interdum donec sit magnis. Etiam purus purus purus
            tristique semper nam.
          </p>
        </div>
      </section>
    </main>

    <!-- Footer with Button -->
    <Footer position="fixed">
      <!-- Check In Button -->
      <Button variant="primary" size="sm" class="w-full" @click="handleCheckInClick">
        Check In
      </Button>
    </Footer>

    <!-- Confirmation Bottom Sheet -->
    <ConfirmationBottomSheet
      v-model:open="showConfirmationSheet"
      :image="MascotIllustration"
      image-height="h-64"
      title="Check in berhasil?"
      description="Apakah anda yakin untuk melakukan check in?"
      button-layout="row"
      :buttons="[
        {
          label: 'Kembali',
          variant: 'secondary',
          onClick: handleCancelCheckIn,
        },
        {
          label: 'Check In',
          variant: 'primary',
          onClick: handleConfirmCheckIn,
        },
      ]"
    />
  </div>
</template>
