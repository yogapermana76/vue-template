<script setup lang="ts">
  import { Package } from 'lucide-vue-next'
  import type { Product } from '../types'

  defineProps<{
    product: Product
  }>()
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="bg-primary-50 text-primary-700 flex size-9 shrink-0 items-center justify-center rounded-lg"
    >
      <Package class="size-4" />
    </div>
    <div class="min-w-0">
      <p class="body-m-semibold text-foreground truncate">{{ product.name }}</p>
      <p class="body-caption text-muted-foreground">{{ product.sku }}</p>
    </div>
  </div>
</template>
