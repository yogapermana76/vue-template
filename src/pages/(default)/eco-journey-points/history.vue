<script setup lang="ts">
  import { ref } from 'vue'
  import { Header } from '@/components/layout'
  import { EmptyState } from '@/components/ui/empty-state'
  import { Button } from '@/components/ui/button'
  import { TransactionHistorySection } from '@/components/eco-journey-points/sections/history'
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

  // Mock data - grouped by date
  const transactionHistory = ref<TransactionGroup[]>([
    {
      label: 'Hari Ini',
      transactions: [
        {
          id: '1',
          title: 'MRT (Mass Rapid Transit )',
          date: 'Hari ini, 07:00WIB',
          points: 5,
        },
        {
          id: '2',
          title: 'MRT (Mass Rapid Transit )',
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
          title: 'Trans Jakarta',
          date: 'Kemarin, 17:00WIB',
          points: 5,
        },
        {
          id: '5',
          title: 'Trans Jakarta',
          date: 'Kemarin, 06:00WIB',
          points: 5,
        },
      ],
    },
    {
      label: 'April 2026',
      transactions: [
        {
          id: '6',
          title: 'Trans Jakarta',
          date: '07 April 2026, 17:00WIB',
          points: 5,
        },
        {
          id: '7',
          title: 'Trans Jakarta',
          date: '07 April 2026, 06:00WIB',
          points: 5,
        },
      ],
    },
  ])
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
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
          title="Mulai Kumpulkan Poin!"
          description="Riwayat anda masih kosong. Segera scan QR untuk mendapatkan poin"
        >
          <template #actions>
            <Button class="w-full">Scan QR</Button>
          </template>
        </EmptyState>
      </div>

      <!-- Content when has data -->
      <TransactionHistorySection v-else :transaction-history="transactionHistory" />
    </main>
  </div>
</template>
