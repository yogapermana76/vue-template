<script setup lang="ts">
  import { DetailField, DetailSection } from '@/components/ui/side-sheet'
  import { formatDate } from '@/utils/date'
  import type { Order } from '../types'

  defineProps<{
    order: Order
  }>()

  const date = (v: string) => formatDate(v, 'dd MMM yyyy')
</script>

<template>
  <DetailSection title="Customer">
    <DetailField label="Name" :value="order.customerName" />
    <DetailField label="Email" :value="order.customerEmail" />
    <DetailField label="Shipping address" :value="order.shippingAddress" wide />
    <DetailField v-if="order.notes" label="Notes" wide>{{ order.notes }}</DetailField>
  </DetailSection>

  <DetailSection title="Timeline" :columns="1">
    <p class="body-caption leading-6 text-neutral-600">
      Created on
      <span class="body-caption-semibold text-foreground">{{ date(order.createdAt) }}</span
      >.
      <br />
      Last updated on
      <span class="body-caption-semibold text-foreground">{{ date(order.updatedAt) }}</span
      >.
    </p>
  </DetailSection>
</template>
