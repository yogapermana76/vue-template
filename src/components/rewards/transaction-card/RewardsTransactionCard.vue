<script setup lang="ts">
  import { computed, type Component, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  export interface RewardsTransactionCardProps {
    /** Transaction title (e.g., "Marketplace", "SPKLU", "Voucher 100.000") */
    title: string
    /** Transaction date/time string (e.g., "Hari ini, 07:00WIB") */
    date: string
    /** Points amount (positive or negative) */
    points: number
    /** Optional custom icon component (defaults to coin icon) */
    icon?: Component
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardsTransactionCardProps>(), {
    icon: () => CoinIcon,
  })

  // Compute display text for points
  const pointsText = computed(() => {
    const sign = props.points >= 0 ? '+' : ''
    return `${sign}${props.points} point`
  })

  // Compute color class based on positive/negative
  const pointsColorClass = computed(() => {
    return props.points >= 0 ? 'text-green-800' : 'text-red-600'
  })
</script>

<template>
  <div
    data-slot="rewards-transaction-card"
    :class="
      cn(
        'flex flex-row items-start gap-2 rounded-sm border border-slate-200 bg-white p-3',
        props.class,
      )
    "
  >
    <!-- Information Section -->
    <div class="flex flex-1 flex-col gap-1">
      <!-- Title -->
      <p class="body-m-semibold text-slate-950">{{ title }}</p>

      <!-- Date -->
      <p class="body-caption text-slate-500">{{ date }}</p>
    </div>

    <!-- Points and Icon Container -->
    <div class="flex flex-row items-center gap-2">
      <!-- Points -->
      <p :class="cn('body-caption', pointsColorClass)">{{ pointsText }}</p>

      <!-- Icon -->
      <component :is="props.icon" class="size-4 shrink-0" aria-label="Points icon" />
    </div>
  </div>
</template>
