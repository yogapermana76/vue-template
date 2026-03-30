<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { formatCurrency } from '@/utils/currency'
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <Card class="overflow-hidden transition-shadow hover:shadow-lg">
    <RouterLink :to="`/products/${product.id}`">
      <CardHeader class="p-0">
        <img :src="product.image" :alt="product.title" class="aspect-square w-full object-cover" />
      </CardHeader>
      <CardContent class="space-y-1 p-2">
        <CardTitle class="line-clamp-2 text-xs leading-tight font-medium">
          {{ product.title }}
        </CardTitle>
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold">{{ formatCurrency(product.price, 'USD') }}</span>
          <div class="text-muted-foreground flex items-center text-xs">
            <span>{{ product.rating.rate.toFixed(1) }}</span>
          </div>
        </div>
      </CardContent>
    </RouterLink>
  </Card>
</template>
