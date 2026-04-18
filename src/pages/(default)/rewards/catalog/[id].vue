<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Package, Calendar, Truck } from 'lucide-vue-next'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import { RewardProgramInfo, RewardTermsSection } from '@/components/rewards/sections'
  import LocationIllustration from '@/assets/illustrations/location.svg?component'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  definePage({
    meta: {
      title: 'Detail Reward',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const showLocationSheet = ref(false)

  // Get ID and type from route params and query
  const rewardId = computed(() => route.params.id as string)
  const rewardType = computed(() => (route.query.type as string) || 'voucher')

  // Dynamic page title based on type
  const pageTitle = computed(() => {
    return rewardType.value === 'item' ? 'Detail Item' : 'Detail Voucher'
  })

  // Dynamic data based on type - TODO: Fetch based on rewardId and rewardType
  const programInfo = computed(() => {
    if (rewardType.value === 'item') {
      return {
        title: 'Blender Philips HR2106',
        description:
          'Dapatkan blender berkualitas tinggi dari Philips dengan menukarkan poin Anda. Blender ini dilengkapi dengan motor 400W yang kuat dan kapasitas 1.5 liter. Cocok untuk membuat jus, smoothie, dan berbagai minuman sehat lainnya. Barang akan dikirimkan ke alamat Anda dalam waktu 7-14 hari kerja.',
      }
    }
    return {
      title: 'Voucher Listrik Rp20.000',
      description:
        'Dapatkan voucher listrik senilai Rp20.000 untuk memenuhi kebutuhan listrik rumah Anda. Voucher ini dapat langsung digunakan untuk pembelian token listrik melalui aplikasi PLN Mobile. Nikmati kemudahan berbelanja token listrik dengan harga lebih hemat!',
    }
  })

  const stats = computed(() => {
    if (rewardType.value === 'item') {
      return [
        {
          id: 'stock',
          label: 'Stok Tersisa',
          value: '12 Unit',
          icon: Package,
        },
        {
          id: 'shipping',
          label: 'Estimasi Pengiriman',
          value: '7-14 Hari Kerja',
          icon: Truck,
        },
        {
          id: 'period',
          label: 'Periode Promo',
          value: 'Hingga 31 Desember 2026',
          icon: Calendar,
        },
        {
          id: 'points',
          label: 'Koin yang ditukar',
          value: '15.000 Poin',
          icon: CoinIcon,
        },
      ]
    }
    return [
      {
        id: 'remaining',
        label: 'Voucher Tersisa',
        value: '5 Voucher',
        icon: Package,
      },
      {
        id: 'period',
        label: 'Periode Promo',
        value: 'Hingga 31 Desember 2026',
        icon: Calendar,
      },
      {
        id: 'points',
        label: 'Koin yang ditukar',
        value: '3.500 Poin',
        icon: CoinIcon,
      },
    ]
  })

  const termsItems = computed(() => {
    if (rewardType.value === 'item') {
      return [
        {
          id: 'usage',
          title: 'Cara Penukaran',
          content: `
            <ol class="list-decimal pl-5 flex flex-col gap-2">
              <li class="pl-1">Buka aplikasi PLN Mobile dan navigasi ke menu rewards</li>
              <li class="pl-1">Pilih barang yang ingin Anda tukarkan</li>
              <li class="pl-1">Pastikan Anda memiliki poin yang cukup untuk penukaran</li>
              <li class="pl-1">Lengkapi alamat pengiriman dengan benar dan lengkap</li>
              <li class="pl-1">Klik tombol "Tukarkan Poin" untuk memulai proses penukaran</li>
              <li class="pl-1">Barang akan dikirimkan ke alamat yang terdaftar dalam 7-14 hari kerja</li>
            </ol>
          `,
        },
        {
          id: 'specs',
          title: 'Spesifikasi Produk',
          content: `
            <ul class="list-disc pl-5 flex flex-col gap-2">
              <li class="pl-1">Merk: Philips</li>
              <li class="pl-1">Tipe: HR2106</li>
              <li class="pl-1">Kapasitas: 1.5 Liter</li>
              <li class="pl-1">Daya: 400 Watt</li>
              <li class="pl-1">Garansi Resmi: 1 Tahun</li>
              <li class="pl-1">Warna: Putih</li>
            </ul>
          `,
        },
        {
          id: 'terms',
          title: 'Syarat & Ketentuan',
          content: `
            <ol class="list-decimal pl-5 flex flex-col gap-2">
              <li class="pl-1">Barang berlaku untuk seluruh pengguna aplikasi PLN Mobile di Indonesia.</li>
              <li class="pl-1">Periode promo berlangsung hingga 31 Desember 2026 atau selama persediaan masih ada.</li>
              <li class="pl-1">Barang tidak dapat diuangkan atau dikembalikan setelah dikirim.</li>
              <li class="pl-1">Setiap pengguna dapat menukar maksimal 2 barang per bulan.</li>
              <li class="pl-1">Pastikan alamat pengiriman sudah lengkap dan benar.</li>
              <li class="pl-1">Kerusakan akibat pengiriman menjadi tanggung jawab ekspedisi.</li>
              <li class="pl-1">PLN berhak membatalkan transaksi jika ditemukan kecurangan.</li>
            </ol>
          `,
        },
      ]
    }
    return [
      {
        id: 'usage',
        title: 'Cara Penggunaan',
        content: `
          <ol class="list-decimal pl-5 flex flex-col gap-2">
            <li class="pl-1">Buka aplikasi PLN Mobile dan navigasi ke menu rewards</li>
            <li class="pl-1">Pilih voucher yang ingin Anda tukarkan</li>
            <li class="pl-1">Pastikan Anda memiliki poin yang cukup untuk penukaran</li>
            <li class="pl-1">Lengkapi alamat pengiriman jika diperlukan</li>
            <li class="pl-1">Klik tombol "Tukarkan Poin" untuk memulai proses penukaran</li>
            <li class="pl-1">Voucher akan dikirimkan ke alamat yang terdaftar</li>
          </ol>
        `,
      },
      {
        id: 'terms',
        title: 'Syarat & Ketentuan',
        content: `
          <ol class="list-decimal pl-5 flex flex-col gap-2">
            <li class="pl-1">Voucher berlaku untuk seluruh pengguna aplikasi PLN Mobile di Indonesia.</li>
            <li class="pl-1">Periode promo berlangsung hingga 31 Desember 2026 atau selama persediaan masih ada.</li>
            <li class="pl-1">Voucher dapat digunakan untuk pembelian token listrik melalui aplikasi PLN Mobile.</li>
            <li class="pl-1">Setiap pengguna dapat menukar maksimal 3 voucher per bulan.</li>
            <li class="pl-1">Voucher tidak dapat diuangkan atau dikembalikan.</li>
            <li class="pl-1">Pastikan alamat pengiriman sudah lengkap dan benar.</li>
            <li class="pl-1">PLN berhak membatalkan transaksi jika ditemukan kecurangan.</li>
          </ol>
        `,
      },
    ]
  })

  const handleExchangeClick = () => {
    showLocationSheet.value = true
  }

  const handleCompleteAddress = () => {
    showLocationSheet.value = false
    router.push('/rewards/complete-address')
  }
</script>

<template>
  <!-- Header -->
  <Header :title="pageTitle" positioning="sticky" />

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

  <!-- Location Confirmation Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showLocationSheet"
    :image="LocationIllustration"
    title="Alamat belum lengkap"
    description="Lengkapi dahulu alamat anda agar kami mudah dalam mengirim hadiah untuk anda."
    button-layout="column"
    :buttons="[
      {
        label: 'Lengkapi alamat',
        variant: 'primary',
        onClick: handleCompleteAddress,
      },
    ]"
  />
</template>
