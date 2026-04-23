<script setup lang="ts">
  import { Image } from '@/components/ui'
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <Image :src="product.image" :alt="product.title" aspect-ratio="square" container-class="w-full" />
</template>
