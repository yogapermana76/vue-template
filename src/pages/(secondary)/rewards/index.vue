<script setup lang="ts">
  import { Ticket, Calendar, Coins } from 'lucide-vue-next'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'

  definePage({
    meta: {
      title: 'Detail Promo',
    },
  })

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
      icon: Coins,
    },
  ]

  // HTML string untuk syarat dan ketentuan dengan Tailwind classes
  const termsHtml = `
<ol class="list-decimal pl-5 flex flex-col gap-0.5">
  <li class="pl-1">Program berlaku untuk seluruh pengguna aplikasi PLN Mobile di Indonesia.</li>
  <li class="pl-1">Periode promo berlangsung dari 20 Januari - 20 Desember 2025.</li>
  <li class="pl-1">Setiap transaksi pembayaran tagihan atau pembelian token melalui aplikasi akan otomatis tercatat sebagai 1 (satu) kesempatan undian.</li>
  <li class="pl-1">Hadiah utama meliputi:
    <ol class="list-[lower-alpha] pl-4 mt-0.5 flex flex-col gap-0.5">
      <li class="pl-1">4 unit mobil listrik</li>
      <li class="pl-1">12 motor listrik</li>
      <li class="pl-1">24 sepeda listrik</li>
      <li class="pl-1">24 mesin cuci</li>
      <li class="pl-1">24 kulkas</li>
      <li class="pl-1">200 voucher menarik</li>
    </ol>
  </li>
  <li class="pl-1">Pemenang akan diumumkan secara resmi melalui aplikasi dan kanal media sosial PLN Mobile.</li>
  <li class="pl-1">Keputusan panitia bersifat final dan tidak dapat diganggu gugat.</li>
  <li class="pl-1">Pajak hadiah ditanggung oleh PLN.</li>
</ol>
`
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header title="Detail Promo" show-back hide-theme-toggle positioning="sticky" />

    <!-- Hero Background Image -->
    <div class="bg-primary-400 relative h-[187px] w-full">
      <img
        src="https://picsum.photos/375/187"
        alt="Promo Banner"
        class="h-full w-full object-cover"
      />
      <!-- Rounded Overlap Shape -->
      <div class="absolute bottom-0 left-0 h-4 w-full rounded-t-md bg-white" />
    </div>

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
      <!-- Program Info Section -->
      <section class="flex flex-col gap-3">
        <!-- Title & Description -->
        <div class="flex flex-col gap-1">
          <h1 class="heading-s text-slate-950">{{ programInfo.title }}</h1>
          <p class="body-caption text-slate-600">{{ programInfo.description }}</p>
        </div>

        <!-- Stats Card -->
        <div class="bg-primary-50 flex flex-col gap-3 rounded-sm p-3">
          <div v-for="stat in stats" :key="stat.id" class="flex flex-col gap-1">
            <span class="body-caption-medium text-slate-800">{{ stat.label }}</span>
            <div class="flex items-center gap-1.5">
              <component :is="stat.icon" class="text-primary-600 size-3 shrink-0" />
              <span class="body-m-medium text-slate-950">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Terms & Conditions Section -->
      <section class="flex flex-col gap-2">
        <h2 class="body-m-semibold text-slate-950">Syarat & Ketentuan:</h2>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="body-caption text-slate-800" v-html="termsHtml" />
      </section>
    </main>

    <!-- Footer with Button -->
    <Footer position="fixed">
      <Button variant="primary" size="sm" class="w-full">Tukar Poin</Button>
    </Footer>
  </div>
</template>
