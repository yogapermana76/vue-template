<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Card, CardContent, CardHeader, CardTitle, Image } from '@/components/ui'
  import { formatCurrency } from '@/utils/currency'
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <Card class="hover:border-primary-300 overflow-hidden transition-shadow hover:shadow-lg">
    <RouterLink :to="`/demo/examples/products/${product.id}`">
      <CardHeader class="p-0">
        <Image :src="product.image" :alt="product.title" aspect-ratio="square" />
      </CardHeader>
      <CardContent class="space-y-1 p-3">
        <CardTitle class="line-clamp-2 text-xs leading-tight font-medium">
          {{ product.title }}
        </CardTitle>
        <div class="flex items-center justify-between">
          <span class="text-primary-600 text-sm font-bold">{{
            formatCurrency(product.price, 'USD')
          }}</span>
          <div class="text-warning-600 flex items-center text-xs font-medium">
            <span>{{ product.rating.rate.toFixed(1) }}</span>
          </div>
        </div>
      </CardContent>
    </RouterLink>
  </Card>
</template>
