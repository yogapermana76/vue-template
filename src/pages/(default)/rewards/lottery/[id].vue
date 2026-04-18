<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Ticket, Calendar } from 'lucide-vue-next'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import { RewardProgramInfo, RewardTermsSection } from '@/components/rewards/sections'
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  definePage({
    meta: {
      title: 'Detail Lottery',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const showConfirmationSheet = ref(false)

  // Get ID from route params
  const drawId = computed(() => route.params.id as string)

  // Data - TODO: Fetch based on drawId
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
      value: 'Mei - November 2026',
      icon: Calendar,
    },
    {
      id: 'points',
      label: 'Koin yang ditukar',
      value: '50 Poin',
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
          <li class="pl-1">Pilih undian yang ingin Anda ikuti</li>
          <li class="pl-1">Pastikan Anda memiliki poin yang cukup untuk penukaran kupon undian</li>
          <li class="pl-1">Klik tombol "Tukarkan Poin" untuk mendapatkan kupon undian</li>
          <li class="pl-1">Kupon undian akan otomatis masuk ke akun Anda</li>
          <li class="pl-1">Tunggu pengumuman pemenang sesuai periode yang ditentukan</li>
        </ol>
      `,
    },
    {
      id: 'terms',
      title: 'Syarat & Ketentuan',
      content: `
        <ol class="list-decimal pl-5 flex flex-col gap-2">
          <li class="pl-1">Program berlaku untuk seluruh pengguna aplikasi PLN Mobile di Indonesia.</li>
          <li class="pl-1">Periode promo berlangsung dari Mei - November 2026.</li>
          <li class="pl-1">Setiap penukaran poin akan mendapatkan 1 (satu) kupon undian.</li>
          <li class="pl-1">Hadiah utama meliputi: 4 unit mobil listrik, 12 motor listrik, 24 sepeda listrik, 24 mesin cuci, 24 kulkas, dan 200 voucher menarik.</li>
          <li class="pl-1">Pemenang akan diumumkan secara resmi melalui aplikasi dan kanal media sosial PLN Mobile.</li>
          <li class="pl-1">Keputusan panitia bersifat final dan tidak dapat diganggu gugat.</li>
          <li class="pl-1">Pajak hadiah ditanggung oleh PLN.</li>
        </ol>
      `,
    },
  ]

  const pointsRequired = 50

  const handleExchangeClick = () => {
    showConfirmationSheet.value = true
  }

  const handleConfirmExchange = () => {
    showConfirmationSheet.value = false
    router.push(`/rewards/redemption/${drawId.value}`)
  }

  const handleCancelExchange = () => {
    showConfirmationSheet.value = false
  }
</script>

<template>
  <!-- Header -->
  <Header title="Detail Lottery" positioning="sticky" />

  <!-- Hero Banner Section -->
  <HeroBanner />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
    <!-- Program Info Section -->
    <RewardProgramInfo :program-info="programInfo" :stats="stats" />

    <!-- Terms & Conditions Section -->
    <RewardTermsSection :items="termsItems" />
  </main>

  <!-- Footer with Button -->
  <Footer position="fixed">
    <Button variant="primary" size="sm" class="w-full" @click="handleExchangeClick">
      Tukarkan Poin
    </Button>
  </Footer>

  <!-- Confirmation Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showConfirmationSheet"
    :image="MascotIllustration"
    title="Menukarkan hadiah?"
    :description="`Apakah anda ingin menukarkan ${pointsRequired} poin untuk mendapatkan kupon undian ini?`"
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
</template>
