<script setup lang="ts">
  import { type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { EcoJourneyTransactionCard } from '@/components/eco-journey-points/transaction-card'

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

  export interface TransactionHistorySectionProps {
    /** Grouped transaction history data */
    transactionHistory: TransactionGroup[]
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = defineProps<TransactionHistorySectionProps>()
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <!-- Transaction Groups -->
    <div v-for="group in props.transactionHistory" :key="group.label" class="flex flex-col gap-3">
      <!-- Date Label -->
      <h3 class="body-m-semibold text-slate-950">{{ group.label }}</h3>

      <!-- Transactions List -->
      <div class="flex flex-col gap-2">
        <EcoJourneyTransactionCard
          v-for="transaction in group.transactions"
          :key="transaction.id"
          :title="transaction.title"
          :date="transaction.date"
          :points="transaction.points"
        />
      </div>
    </div>
  </div>
</template>
