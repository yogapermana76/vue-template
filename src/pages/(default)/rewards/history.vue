<script setup lang="ts">
  import { ref } from 'vue'
  import { Header } from '@/components/layout'
  import { EmptyState } from '@/components/ui/empty-state'
  import {
    PointsInfoSection,
    TransactionHistorySection,
  } from '@/components/rewards/sections/history'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  definePage({
    meta: {
      title: 'Riwayat Penukaran Point',
    },
  })

  interface TransactionItem {
    id: string
    title: string
    date: string
    points: number
  }

  interface TransactionGroup {
    label: string
    transactions: TransactionItem[]
  }

  // Points and active until state
  const points = ref(0)
  const activeUntil = ref('30 Dec 2026')

  // Mock data - grouped by date
  const transactionHistory = ref<TransactionGroup[]>([
    {
      label: 'Hari Ini',
      transactions: [
        {
          id: '1',
          title: 'Marketplace',
          date: 'Hari ini, 07:00WIB',
          points: 5,
        },
        {
          id: '2',
          title: 'SPKLU',
          date: 'Hari ini, 18:00WIB',
          points: 5,
        },
        {
          id: '3',
          title: 'Voucher 100.000',
          date: 'Hari ini, 18:00WIB',
          points: -50,
        },
      ],
    },
    {
      label: 'Kemarin',
      transactions: [
        {
          id: '4',
          title: 'Pembelian Token',
          date: 'Kemarin, 17:00WIB',
          points: 5,
        },
        {
          id: '5',
          title: 'Pembelian Token',
          date: 'Kemarin, 06:00WIB',
          points: 5,
        },
        {
          id: '8',
          title: 'Belanja Marketplace',
          date: 'Kemarin, 14:30WIB',
          points: 10,
        },
      ],
    },
    {
      label: '8 April 2026',
      transactions: [
        {
          id: '9',
          title: 'Pembelian Token',
          date: '08 April 2026, 19:00WIB',
          points: 5,
        },
        {
          id: '10',
          title: 'Top Up SPKLU',
          date: '08 April 2026, 11:00WIB',
          points: 8,
        },
        {
          id: '11',
          title: 'Voucher Belanja',
          date: '08 April 2026, 09:00WIB',
          points: -25,
        },
      ],
    },
    {
      label: '7 April 2026',
      transactions: [
        {
          id: '6',
          title: 'Pembelian Token',
          date: '07 April 2026, 17:00WIB',
          points: 5,
        },
        {
          id: '7',
          title: 'Pembelian Token',
          date: '07 April 2026, 06:00WIB',
          points: 5,
        },
        {
          id: '12',
          title: 'Cashback Marketplace',
          date: '07 April 2026, 20:00WIB',
          points: 15,
        },
      ],
    },
    {
      label: '6 April 2026',
      transactions: [
        {
          id: '13',
          title: 'Pembelian Token',
          date: '06 April 2026, 18:00WIB',
          points: 5,
        },
        {
          id: '14',
          title: 'Voucher Gratis',
          date: '06 April 2026, 10:00WIB',
          points: -30,
        },
      ],
    },
    {
      label: '5 April 2026',
      transactions: [
        {
          id: '15',
          title: 'Top Up Energi',
          date: '05 April 2026, 16:00WIB',
          points: 20,
        },
        {
          id: '16',
          title: 'Pembelian Token',
          date: '05 April 2026, 08:00WIB',
          points: 5,
        },
      ],
    },
    {
      label: '4 April 2026',
      transactions: [
        {
          id: '17',
          title: 'Voucher 50.000',
          date: '04 April 2026, 15:00WIB',
          points: -40,
        },
      ],
    },
  ])
</script>

<template>
  <!-- Header -->
  <Header title="Riwayat" positioning="sticky" />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-6 px-4 py-4">
    <!-- Empty State -->
    <div
      v-if="transactionHistory.length === 0"
      class="flex flex-1 flex-col items-center justify-center"
    >
      <EmptyState
        :image="RiwayatIllustration"
        title="Belum ada riwayat"
        description="Anda belum memiliki riwayat penukaran point. Mulai tukar poin anda sekarang!"
      />
    </div>

    <!-- Content when has data -->
    <template v-else>
      <!-- Points Info Section -->
      <PointsInfoSection :points="points" :active-until="activeUntil" />

      <!-- Transaction History Section -->
      <TransactionHistorySection :transaction-history="transactionHistory" />
    </template>
  </main>
</template>
