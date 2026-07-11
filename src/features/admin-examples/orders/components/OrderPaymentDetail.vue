<script setup lang="ts">
  import { DetailField, DetailSection } from '@/components/ui/side-sheet'
  import { formatDate } from '@/utils/date'
  import { orderPaymentMethodLabel } from '../constants'
  import OrderStatusBadge from './OrderStatusBadge.vue'
  import type { Order } from '../types'

  defineProps<{
    order: Order
  }>()

  const date = (v: string) => formatDate(v, 'dd MMM yyyy')
</script>

<template>
  <DetailSection title="Payment & Status" :columns="1">
    <DetailField label="Status">
      <OrderStatusBadge :status="order.status" />
    </DetailField>
    <DetailField label="Payment method" :value="orderPaymentMethodLabel[order.paymentMethod]" />
    <DetailField label="Created" :value="date(order.createdAt)" />
    <DetailField label="Last updated" :value="date(order.updatedAt)" />
  </DetailSection>
</template>
