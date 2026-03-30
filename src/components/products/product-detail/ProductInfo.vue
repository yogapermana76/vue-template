<script setup lang="ts">
  import { Star } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { formatCurrency } from '@/utils/currency'
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <div class="flex flex-col p-4">
    <!-- Category Badge -->
    <Badge variant="secondary" class="mb-2 w-fit text-xs">
      {{ product.category }}
    </Badge>

    <!-- Title -->
    <h1 class="mb-2 text-lg leading-tight font-bold">
      {{ product.title }}
    </h1>

    <!-- Rating -->
    <div class="mb-3 flex items-center gap-2">
      <div class="flex items-center">
        <Star class="size-4 fill-yellow-400 text-yellow-400" />
        <span class="ml-1 text-sm font-medium">
          {{ product.rating.rate.toFixed(1) }}
        </span>
      </div>
      <span class="text-muted-foreground text-xs"> ({{ product.rating.count }} reviews) </span>
    </div>

    <!-- Price -->
    <div class="text-2xl font-bold">
      {{ formatCurrency(product.price, 'USD') }}
    </div>
  </div>
</template>
