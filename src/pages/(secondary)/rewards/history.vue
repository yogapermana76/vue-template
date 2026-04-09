<script setup lang="ts">
  import { ref } from 'vue'
  import { Header } from '@/components/layout'
  import { RewardsTransactionCard } from '@/components/rewards'

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
      ],
    },
    {
      label: 'April 2026',
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
      ],
    },
  ])
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header title="Riwayat" show-back hide-theme-toggle positioning="sticky" />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4 py-4">
      <!-- Transaction Groups -->
      <div v-for="group in transactionHistory" :key="group.label" class="flex flex-col gap-3">
        <!-- Date Label -->
        <h3 class="body-m-semibold text-slate-950">{{ group.label }}</h3>

        <!-- Transactions List -->
        <div class="flex flex-col gap-2">
          <RewardsTransactionCard
            v-for="transaction in group.transactions"
            :key="transaction.id"
            :title="transaction.title"
            :date="transaction.date"
            :points="transaction.points"
          />
        </div>
      </div>
    </main>

    <!-- Empty State Placeholder -->
    <div
      v-if="transactionHistory.length === 0"
      class="flex flex-1 flex-col items-center justify-center px-4"
    >
      <p class="body-m text-slate-600">Belum ada riwayat penukaran point</p>
    </div>
  </div>
</template>
