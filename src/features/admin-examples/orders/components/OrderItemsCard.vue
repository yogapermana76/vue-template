<script setup lang="ts">
  import { Card } from '@/components/ui/card'
  import { formatCurrency } from '@/utils/currency'
  import type { OrderItem } from '../types'

  defineProps<{
    items: OrderItem[]
    totalAmount: number
  }>()

  const amount = (v: number) => formatCurrency(v, 'USD')
</script>

<template>
  <Card class="overflow-hidden p-0">
    <div class="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
      <h3 class="body-caption-semibold text-primary-700 shrink-0 tracking-widest uppercase">
        Items
      </h3>
      <span class="body-caption text-muted-foreground">· {{ items.length }} total</span>
      <div class="h-px flex-1 bg-neutral-100" />
    </div>

    <div class="divide-y divide-neutral-100">
      <div v-for="item in items" :key="item.id" class="flex items-center gap-3 px-6 py-3.5">
        <div class="min-w-0 flex-1">
          <p class="body-m-semibold text-foreground truncate">{{ item.productName }}</p>
          <p class="body-caption text-muted-foreground">SKU {{ item.sku }}</p>
        </div>
        <div class="shrink-0 text-right">
          <p class="body-m-medium">{{ item.qty }} × {{ amount(item.price) }}</p>
          <p class="body-caption text-muted-foreground">{{ amount(item.qty * item.price) }}</p>
        </div>
      </div>
    </div>

    <div
      class="bg-primary-50/50 flex items-center justify-between border-t border-neutral-200 px-6 py-4"
    >
      <span class="body-m-medium text-muted-foreground">Total</span>
      <span class="heading-s text-foreground">{{ amount(totalAmount) }}</span>
    </div>
  </Card>
</template>
