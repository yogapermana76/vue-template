<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { QrScanner } from '@/components/ui/qr-scanner'
  import { ConfirmationBottomSheet } from '@/components/shared/confirmation-bottom-sheet'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'

  definePage({
    meta: {
      title: 'Check In',
    },
  })

  const router = useRouter()
  const showQrScanner = ref(false)
  const showBottomSheet = ref(false)
  const sheetState = ref<'confirm' | 'success' | 'error'>('confirm')

  // Sheet content configuration for each state
  const SHEET_CONFIG = {
    confirm: {
      title: 'Check In Sekarang',
      description:
        'Lakukan checkin sekarang dan dapatkan 5 poin langsung untuk dapat menukarkan hadiah menarik',
      buttonLayout: 'row' as const,
    },
    success: {
      title: 'Selamat anda mendapatkan 5 poin',
      description: 'Kumpulkan sebanyak-banyaknya dan tukar dengan hadiah yang menarik.',
      buttonLayout: 'column' as const,
    },
    error: {
      title: 'Terdapat Kesalahan',
      description:
        'Sepertinya terdapat kesalahan saat anda memindai. Pastikan kamera dan kode QR anda telah benar ya',
      buttonLayout: 'column' as const,
    },
  }

  // Open confirmation sheet when check in button clicked
  const handleCheckInClick = () => {
    sheetState.value = 'confirm'
    showBottomSheet.value = true
  }

  // Handle primary button action based on current state
  const handleSheetAction = () => {
    showBottomSheet.value = false
    if (sheetState.value === 'confirm' || sheetState.value === 'error') {
      // Open QR scanner for confirm and error states
      showQrScanner.value = true
    } else {
      // Navigate back after success
      router.push('/eco-journey-points')
    }
  }

  // Handle successful QR scan
  const handleQrDetect = () => {
    showQrScanner.value = false
    sheetState.value = 'success'
    showBottomSheet.value = true
  }

  // Handle QR scan error
  const handleQrError = () => {
    showQrScanner.value = false
    sheetState.value = 'error'
    showBottomSheet.value = true
  }
</script>

<template>
  <!-- Header -->
  <Header positioning="sticky" />

  <!-- Hero Banner Section -->
  <HeroBanner />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
    <!-- Title & Description Section -->
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="heading-s text-slate-950">Judul Event</h1>
        <p class="body-caption text-slate-600">
          Lorem ipsum dolor sit amet consectetur. Diam aliquet purus sed viverra gravida etiam. Ut
          vitae sagittis risus a in. Integer odio tellus sed aliquam viverra tempus sit volutpat.
          Enim cursus feugiat enim faucibus. Diam netus amet vitae etiam nisl. Sed ullamcorper proin
          purus vitae eget mi. Vitae non luctus laoreet integer dictumst nulla sed. Eget ullamcorper
          auctor est eleifend neque interdum donec sit magnis. Etiam purus purus purus tristique
          semper nam.
        </p>
      </div>
    </section>
  </main>

  <!-- Footer with Button -->
  <Footer position="fixed">
    <Button variant="primary" size="sm" class="w-full" @click="handleCheckInClick">
      Check In
    </Button>
  </Footer>

  <!-- QR Scanner -->
  <QrScanner
    v-model:open="showQrScanner"
    instruction-text="Pindai kode QR yang sudah disediakan"
    @detect="handleQrDetect"
    @error="handleQrError"
  />

  <!-- Dynamic Confirmation Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showBottomSheet"
    :image="MascotIllustration"
    :title="SHEET_CONFIG[sheetState].title"
    :description="SHEET_CONFIG[sheetState].description"
    :button-layout="SHEET_CONFIG[sheetState].buttonLayout"
    :buttons="
      sheetState === 'confirm'
        ? [
            { label: 'Kembali', variant: 'secondary', onClick: () => (showBottomSheet = false) },
            { label: 'Check In', variant: 'primary', onClick: handleSheetAction },
          ]
        : [
            {
              label: sheetState === 'success' ? 'Kembali' : 'Scan Kembali',
              variant: 'primary',
              onClick: handleSheetAction,
            },
          ]
    "
  />
</template>
