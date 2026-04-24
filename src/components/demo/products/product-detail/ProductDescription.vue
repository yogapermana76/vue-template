<script setup lang="ts">
  import type { Product } from '@/services/demo/product.service'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <div class="flex flex-1 flex-col px-4">
    <!-- Description -->
    <p class="text-sm leading-relaxed text-neutral-600">
      {{ product.description }}
    </p>
  </div>
</template>
