<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Package, Calendar, Truck, CheckCircle2, Ticket } from 'lucide-vue-next'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { RewardProgramInfo, RewardTermsSection } from '@/components/rewards/sections'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  definePage({
    meta: {
      title: 'Detail Reward Saya',
    },
  })

  const route = useRoute()
  const router = useRouter()

  // Get ID and type from route params and query
  const rewardId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })
  const rewardType = computed(() => (route.query.type as string) || 'voucher')

  // Dynamic page title based on type
  const pageTitle = computed(() => {
    switch (rewardType.value) {
      case 'lottery-coupon':
        return 'Detail Kupon Undian Saya'
      case 'item':
        return 'Detail Barang Saya'
      default:
        return 'Detail Voucher Saya'
    }
  })

  // Dynamic data based on type - TODO: Fetch based on rewardId and rewardType
  const programInfo = computed(() => {
    switch (rewardType.value) {
      case 'lottery-coupon':
        return {
          title: 'Kupon Undian Gelegar SwaCam',
          description:
            'Kupon undian untuk program Gelegar SwaCam yang sudah berhasil Anda tukarkan. Kupon ini akan otomatis diikutkan dalam undian berhadiah periode Mei - November 2026. Tunggu pengumuman pemenang melalui aplikasi PLN Mobile.',
        }
      case 'item':
        return {
          title: 'Blender Philips HR2106',
          description:
            'Blender berkualitas tinggi dari Philips yang sudah berhasil Anda tukarkan. Barang akan dikirimkan ke alamat yang terdaftar dalam waktu 7-14 hari kerja. Pastikan alamat pengiriman Anda sudah lengkap dan benar.',
        }
      default:
        return {
          title: 'Voucher Listrik Rp20.000',
          description:
            'Voucher listrik senilai Rp20.000 yang sudah berhasil Anda tukarkan. Voucher ini dapat digunakan untuk pembelian token listrik melalui aplikasi PLN Mobile. Gunakan voucher sebelum masa berlaku habis.',
        }
    }
  })

  const stats = computed(() => {
    switch (rewardType.value) {
      case 'lottery-coupon':
        return [
          {
            id: 'status',
            label: 'Status',
            value: 'Aktif',
            icon: CheckCircle2,
          },
          {
            id: 'coupon-number',
            label: 'Nomor Kupon',
            value: 'GLC-2026-001234',
            icon: Ticket,
          },
          {
            id: 'draw-period',
            label: 'Periode Undian',
            value: 'Mei - November 2026',
            icon: Calendar,
          },
          {
            id: 'points',
            label: 'Ditukar dengan',
            value: '50 Poin',
            icon: CoinIcon,
          },
        ]
      case 'item':
        return [
          {
            id: 'status',
            label: 'Status Pengiriman',
            value: 'Dalam Proses',
            icon: Truck,
          },
          {
            id: 'tracking',
            label: 'Nomor Resi',
            value: 'JNE1234567890',
            icon: Package,
          },
          {
            id: 'estimated',
            label: 'Estimasi Tiba',
            value: '25 April 2026',
            icon: Calendar,
          },
          {
            id: 'points',
            label: 'Ditukar dengan',
            value: '15.000 Poin',
            icon: CoinIcon,
          },
        ]
      default:
        return [
          {
            id: 'status',
            label: 'Status',
            value: 'Aktif',
            icon: CheckCircle2,
          },
          {
            id: 'remaining',
            label: 'Sisa Penggunaan',
            value: '1 kali',
            icon: Package,
          },
          {
            id: 'expiry',
            label: 'Berlaku Hingga',
            value: '31 Desember 2026',
            icon: Calendar,
          },
          {
            id: 'points',
            label: 'Ditukar dengan',
            value: '3.500 Poin',
            icon: CoinIcon,
          },
        ]
    }
  })

  const termsItems = computed(() => {
    switch (rewardType.value) {
      case 'lottery-coupon':
        return [
          {
            id: 'draw-info',
            title: 'Informasi Undian',
            content: `
              <ol class="list-decimal pl-5 flex flex-col gap-2">
                <li class="pl-1">Kupon undian Anda telah terdaftar dalam sistem</li>
                <li class="pl-1">Pengundian akan dilakukan pada akhir periode promo</li>
                <li class="pl-1">Pemenang akan diumumkan melalui aplikasi PLN Mobile dan media sosial resmi</li>
                <li class="pl-1">Jika Anda menjadi pemenang, kami akan menghubungi melalui nomor telepon terdaftar</li>
                <li class="pl-1">Hadiah akan dikirimkan sesuai dengan alamat yang terdaftar di akun Anda</li>
              </ol>
            `,
          },
          {
            id: 'prizes',
            title: 'Hadiah Undian',
            content: `
              <ul class="list-disc pl-5 flex flex-col gap-2">
                <li class="pl-1">4 unit Mobil Listrik</li>
                <li class="pl-1">12 unit Motor Listrik</li>
                <li class="pl-1">24 unit Sepeda Listrik</li>
                <li class="pl-1">24 unit Mesin Cuci</li>
                <li class="pl-1">24 unit Kulkas</li>
                <li class="pl-1">200 Voucher menarik</li>
              </ul>
            `,
          },
          {
            id: 'terms',
            title: 'Syarat & Ketentuan',
            content: `
              <ol class="list-decimal pl-5 flex flex-col gap-2">
                <li class="pl-1">Kupon undian berlaku untuk periode yang tertera.</li>
                <li class="pl-1">Satu kupon undian memberikan 1 (satu) kesempatan menang.</li>
                <li class="pl-1">Pemenang akan diverifikasi terlebih dahulu sebelum penyerahan hadiah.</li>
                <li class="pl-1">Keputusan panitia bersifat final dan tidak dapat diganggu gugat.</li>
                <li class="pl-1">Pajak hadiah ditanggung oleh PLN.</li>
                <li class="pl-1">Hadiah tidak dapat ditukar dengan uang tunai.</li>
              </ol>
            `,
          },
        ]
      case 'item':
        return [
          {
            id: 'shipping-info',
            title: 'Informasi Pengiriman',
            content: `
              <ol class="list-decimal pl-5 flex flex-col gap-2">
                <li class="pl-1">Barang akan dikirim ke alamat yang terdaftar di akun Anda</li>
                <li class="pl-1">Estimasi waktu pengiriman adalah 7-14 hari kerja</li>
                <li class="pl-1">Anda akan menerima notifikasi ketika barang sudah dikirim</li>
                <li class="pl-1">Nomor resi pengiriman akan dikirimkan melalui email dan aplikasi</li>
                <li class="pl-1">Pastikan ada yang menerima paket saat kurir datang</li>
                <li class="pl-1">Periksa kondisi barang sebelum menerima dari kurir</li>
              </ol>
            `,
          },
          {
            id: 'product-specs',
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
                <li class="pl-1">Barang yang sudah dikirim tidak dapat dikembalikan atau ditukar.</li>
                <li class="pl-1">Pastikan alamat pengiriman lengkap dan benar sebelum konfirmasi.</li>
                <li class="pl-1">Kerusakan akibat pengiriman menjadi tanggung jawab ekspedisi.</li>
                <li class="pl-1">Laporkan jika ada kerusakan atau ketidaksesuaian dalam 1x24 jam.</li>
                <li class="pl-1">Garansi produk mengikuti ketentuan dari pabrik.</li>
                <li class="pl-1">Komplain hanya diterima dengan bukti foto dan video unboxing.</li>
              </ol>
            `,
          },
        ]
      default:
        return [
          {
            id: 'usage',
            title: 'Cara Penggunaan',
            content: `
              <ol class="list-decimal pl-5 flex flex-col gap-2">
                <li class="pl-1">Buka aplikasi PLN Mobile</li>
                <li class="pl-1">Navigasi ke menu pembelian token listrik</li>
                <li class="pl-1">Pilih nominal token yang ingin dibeli</li>
                <li class="pl-1">Pada halaman pembayaran, pilih "Gunakan Voucher"</li>
                <li class="pl-1">Pilih voucher yang ingin digunakan dari daftar voucher aktif Anda</li>
                <li class="pl-1">Selesaikan transaksi untuk mendapatkan token listrik</li>
              </ol>
            `,
          },
          {
            id: 'terms',
            title: 'Syarat & Ketentuan',
            content: `
              <ol class="list-decimal pl-5 flex flex-col gap-2">
                <li class="pl-1">Voucher hanya dapat digunakan untuk pembelian token listrik.</li>
                <li class="pl-1">Voucher berlaku hingga tanggal yang tertera.</li>
                <li class="pl-1">Voucher tidak dapat diuangkan atau dikembalikan.</li>
                <li class="pl-1">Voucher hanya dapat digunakan 1 (satu) kali.</li>
                <li class="pl-1">Setelah digunakan, voucher tidak dapat dibatalkan.</li>
                <li class="pl-1">PLN berhak membatalkan voucher jika ditemukan penyalahgunaan.</li>
              </ol>
            `,
          },
        ]
    }
  })

  // Dynamic button configuration
  const showFooterButton = computed(() => rewardType.value !== 'lottery-coupon')

  const buttonConfig = computed(() => {
    if (rewardType.value === 'item') {
      return {
        label: 'Lacak Pengiriman',
        action: () => {
          // TODO: Implement tracking logic
          console.log('Track shipment for:', rewardId.value)
        },
      }
    }
    // voucher
    return {
      label: 'Gunakan Voucher',
      action: () => {
        router.push('/electricity/token-purchase')
      },
    }
  })
</script>

<template>
  <!-- Header -->
  <Header :title="pageTitle" positioning="sticky" />

  <!-- Hero Banner Section -->
  <HeroBanner />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-6 px-4" :class="showFooterButton ? 'pb-24' : 'pb-6'">
    <!-- Program Info Section -->
    <RewardProgramInfo :program-info="programInfo" :stats="stats" />

    <!-- Terms & Conditions Section -->
    <RewardTermsSection :items="termsItems" />
  </main>

  <!-- Footer with Button (conditional) -->
  <Footer v-if="showFooterButton" position="fixed">
    <Button variant="primary" size="sm" class="w-full" @click="buttonConfig.action">
      {{ buttonConfig.label }}
    </Button>
  </Footer>
</template>
