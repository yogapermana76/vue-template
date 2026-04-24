<script setup lang="ts">
  import { Star } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { formatCurrency } from '@/utils/currency'
  import type { Product } from '@/services/demo/product.service'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <div class="flex flex-col p-4">
    <!-- Category Badge -->
    <Badge class="bg-primary-100 text-primary-700 border-primary-200 mb-2 w-fit text-xs">
      {{ product.category }}
    </Badge>

    <!-- Title -->
    <h1 class="mb-2 text-lg leading-tight font-bold text-neutral-900">
      {{ product.title }}
    </h1>

    <!-- Rating -->
    <div class="mb-3 flex items-center gap-2">
      <div class="flex items-center">
        <Star class="fill-warning-400 text-warning-400 size-4" />
        <span class="text-warning-700 ml-1 text-sm font-medium">
          {{ product.rating.rate.toFixed(1) }}
        </span>
      </div>
      <span class="text-xs text-neutral-500"> ({{ product.rating.count }} reviews) </span>
    </div>

    <!-- Price -->
    <div class="text-primary-600 text-2xl font-bold">
      {{ formatCurrency(product.price, 'USD') }}
    </div>
  </div>
</template>
