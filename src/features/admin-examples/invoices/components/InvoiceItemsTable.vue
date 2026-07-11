<script setup lang="ts">
  import { Card } from '@/components/ui/card'
  import { formatCurrency, type CurrencyCode } from '@/utils/currency'
  import type { InvoiceLineItem } from '../types'

  defineProps<{
    items: InvoiceLineItem[]
    subtotal: number
    taxRate: number
    tax: number
    total: number
    currency: string
  }>()

  // Cast at boundary: currency is loose string, formatCurrency wants CurrencyCode.
  const money = (v: number, currency: string) => formatCurrency(v, currency as CurrencyCode)
</script>

<template>
  <Card class="overflow-hidden p-0">
    <div class="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
      <h3 class="body-caption-semibold text-primary-700 shrink-0 tracking-widest uppercase">
        Line items
      </h3>
      <div class="h-px flex-1 bg-neutral-100" />
    </div>

    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-neutral-100">
          <th
            class="body-caption-semibold text-muted-foreground px-6 py-2.5 text-left tracking-widest uppercase"
          >
            Description
          </th>
          <th
            class="body-caption-semibold text-muted-foreground px-2 py-2.5 text-center tracking-widest uppercase"
          >
            Qty
          </th>
          <th
            class="body-caption-semibold text-muted-foreground px-2 py-2.5 text-right tracking-widest uppercase"
          >
            Unit
          </th>
          <th
            class="body-caption-semibold text-muted-foreground px-6 py-2.5 text-right tracking-widest uppercase"
          >
            Amount
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-for="item in items" :key="item.id">
          <td class="body-m text-foreground px-6 py-3">{{ item.description }}</td>
          <td class="body-m-medium px-2 py-3 text-center">{{ item.quantity }}</td>
          <td class="body-m px-2 py-3 text-right">{{ money(item.unitPrice, currency) }}</td>
          <td class="body-m-semibold px-6 py-3 text-right">
            {{ money(item.quantity * item.unitPrice, currency) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="bg-primary-50/50 border-t border-neutral-100 px-6 py-4">
      <div class="ml-auto flex max-w-xs flex-col gap-1.5">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Subtotal</span>
          <span class="body-m-medium">{{ money(subtotal, currency) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Tax ({{ taxRate }}%)</span>
          <span class="body-m-medium">{{ money(tax, currency) }}</span>
        </div>
        <div class="border-primary-200 mt-1 flex justify-between border-t pt-2">
          <span class="body-m-semibold">Total</span>
          <span class="heading-s text-foreground">{{ money(total, currency) }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>
