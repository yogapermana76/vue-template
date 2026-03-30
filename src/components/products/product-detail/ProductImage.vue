<script setup lang="ts">
  import { Share2 } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import type { Product } from '@/services/product'

  interface Props {
    product: Product
  }

  defineProps<Props>()
</script>

<template>
  <div class="bg-muted relative aspect-square w-full overflow-hidden">
    <img :src="product.image" :alt="product.title" class="size-full object-cover" />
    <!-- Share button -->
    <Button variant="secondary" size="icon" class="absolute top-3 right-3 size-9 rounded-full">
      <Share2 class="size-4" />
    </Button>
  </div>
</template>
