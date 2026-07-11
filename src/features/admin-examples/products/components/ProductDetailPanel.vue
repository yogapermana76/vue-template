<script setup lang="ts">
  import { DetailField, DetailSection } from '@/components/ui/side-sheet'
  import { formatCurrency } from '@/utils/currency'
  import { formatDate } from '@/utils/date'
  import type { Product } from '../types'

  defineProps<{
    product: Product
  }>()

  const price = (v: number) => formatCurrency(v, 'USD')
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const stockClass = (stock: number) => {
    if (stock === 0) return 'text-error-600'
    if (stock < 20) return 'text-warning-600'
    return 'text-success-600'
  }
</script>

<template>
  <div class="flex flex-col">
    <DetailSection title="Overview">
      <DetailField label="Brand" :value="product.brand" />
      <DetailField label="Category" :value="product.category" />
      <DetailField label="Supplier" :value="product.supplier" />
      <DetailField label="Warehouse" :value="product.warehouse" />
      <DetailField v-if="product.description" label="Description" wide>
        {{ product.description }}
      </DetailField>
    </DetailSection>

    <DetailSection title="Pricing">
      <DetailField label="Price">
        <span class="body-m-semibold">{{ price(product.price) }}</span>
      </DetailField>
      <DetailField label="Cost" :value="price(product.cost)" />
      <DetailField label="Margin">
        <span class="body-m-medium text-success-700">{{ product.margin.toFixed(1) }}%</span>
      </DetailField>
      <DetailField label="Stock">
        <span :class="['body-m-semibold', stockClass(product.stock)]">{{ product.stock }}</span>
      </DetailField>
    </DetailSection>

    <DetailSection title="Metadata" :columns="1">
      <DetailField label="Created at" :value="date(product.createdAt)" />
    </DetailSection>
  </div>
</template>
