<script setup lang="ts">
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <div class="relative aspect-square w-full overflow-hidden bg-neutral-100">
    <img :src="product.image" :alt="product.title" class="size-full object-cover" />
  </div>
</template>
