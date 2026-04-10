<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { Ticket, Calendar } from 'lucide-vue-next'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { ConfirmationBottomSheet } from '@/components/shared/confirmation-bottom-sheet'
  import { CouponListBottomSheet } from '@/components/rewards'
  import {
    EcoJourneyHeroBanner,
    EcoJourneyProgramInfo,
    EcoJourneyTermsSection,
  } from '@/components/eco-journey-points/sections'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  definePage({
    meta: {
      title: 'Detail Voucher',
    },
  })

  const router = useRouter()
  const showConfirmationSheet = ref(false)
  const showCouponListSheet = ref(false)

  // Data
  const programInfo = {
    title: 'Undian Loyalty Program Gelegar SwaCam',
    description:
      'Rasakan keseruan transaksi di PLN Mobile lewat program GELEGAR PLN Mobile 2025! Setiap transaksi bisa bawa kamu makin dekat dengan berbagai hadiah menarik, mulai dari mobil listrik, motor listrik, sepeda listrik, hingga peralatan rumah tangga keren. Semakin sering transaksi, semakin besar kesempatan menangnya!',
  }

  const stats = [
    {
      id: 'coupon',
      label: 'Sisa Kupon',
      value: '340 Kupon',
      icon: Ticket,
    },
    {
      id: 'period',
      label: 'Periode Promo',
      value: 'Agustus - Oktober 2025',
      icon: Calendar,
    },
    {
      id: 'points',
      label: 'Koin yang ditukar',
      value: '3.500 Poin',
      icon: CoinIcon,
    },
  ]

  // Accordion items untuk cara penggunaan dan syarat & ketentuan
  const termsItems = [
    {
      id: 'usage',
      title: 'Cara Penggunaan',
      content: `
        <ol class="list-decimal pl-5 flex flex-col gap-2">
          <li class="pl-1">Buka aplikasi PLN Mobile dan navigasi ke menu rewards</li>
          <li class="pl-1">Pilih hadiah yang ingin Anda tukarkan</li>
          <li class="pl-1">Pastikan Anda memiliki poin yang cukup untuk penukaran</li>
          <li class="pl-1">Klik tombol "Tukar Poin" untuk memulai proses penukaran</li>
          <li class="pl-1">Ikuti instruksi yang muncul untuk menyelesaikan penukaran</li>
          <li class="pl-1">Hadiah akan dikirimkan sesuai dengan data alamat Anda</li>
        </ol>
      `,
    },
    {
      id: 'terms',
      title: 'Syarat & Ketentuan',
      content: `
        <ol class="list-decimal pl-5 flex flex-col gap-2">
          <li class="pl-1">Program berlaku untuk seluruh pengguna aplikasi PLN Mobile di Indonesia.</li>
          <li class="pl-1">Periode promo berlangsung dari 20 Januari - 20 Desember 2025.</li>
          <li class="pl-1">Setiap transaksi pembayaran tagihan atau pembelian token melalui aplikasi akan otomatis tercatat sebagai 1 (satu) kesempatan undian.</li>
          <li class="pl-1">Hadiah utama meliputi: 4 unit mobil listrik, 12 motor listrik, 24 sepeda listrik, 24 mesin cuci, 24 kulkas, dan 200 voucher menarik.</li>
          <li class="pl-1">Pemenang akan diumumkan secara resmi melalui aplikasi dan kanal media sosial PLN Mobile.</li>
          <li class="pl-1">Keputusan panitia bersifat final dan tidak dapat diganggu gugat.</li>
          <li class="pl-1">Pajak hadiah ditanggung oleh PLN.</li>
        </ol>
      `,
    },
  ]

  const handleExchangeClick = () => {
    // Randomly choose between showing coupon list or confirmation sheet
    const isRandomCoupon = Math.random() > 0.5
    if (isRandomCoupon) {
      showCouponListSheet.value = true
    } else {
      showConfirmationSheet.value = true
    }
  }

  const handleConfirmExchange = () => {
    showConfirmationSheet.value = false
    router.push('/eco-journey-points/redemption/1')
  }

  const handleCancelExchange = () => {
    showConfirmationSheet.value = false
  }

  // Computed button label based on reward type
  const buttonLabel = computed(() => {
    return 'Lihat Hadiah'
  })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header title="Detail Voucher" positioning="sticky" />

    <!-- Hero Banner Section -->
    <EcoJourneyHeroBanner />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
      <!-- Program Info Section -->
      <EcoJourneyProgramInfo :program-info="programInfo" :stats="stats" />

      <!-- Terms & Conditions Section -->
      <EcoJourneyTermsSection :items="termsItems" />
    </main>

    <!-- Footer with Button -->
    <Footer position="fixed">
      <Button variant="primary" size="sm" class="w-full" @click="handleExchangeClick">
        {{ buttonLabel }}
      </Button>
    </Footer>

    <!-- Confirmation Bottom Sheet -->
    <ConfirmationBottomSheet
      v-model:open="showConfirmationSheet"
      :image="MascotIllustration"
      image-height="h-64"
      title="Menukarkan hadiah?"
      description="Apakah anda ingin menukarkan 50 poin untuk mendapatkan hadiah ini?"
      button-layout="row"
      :buttons="[
        {
          label: 'Kembali',
          variant: 'secondary',
          onClick: handleCancelExchange,
        },
        {
          label: 'Tukar Poin',
          variant: 'primary',
          onClick: handleConfirmExchange,
        },
      ]"
    />

    <!-- Coupon List Bottom Sheet -->
    <CouponListBottomSheet v-model:open="showCouponListSheet" />
  </div>
</template>
