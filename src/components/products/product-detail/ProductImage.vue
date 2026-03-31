<script setup lang="ts">
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <div class="bg-muted relative aspect-square w-full overflow-hidden">
    <img :src="product.image" :alt="product.title" class="size-full object-cover" />
  </div>
</template>
