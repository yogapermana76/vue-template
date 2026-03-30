<script setup lang="ts">
  import { ShoppingCart } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="bg-background sticky bottom-0 border-t p-4">
    <div class="flex gap-3">
      <Button variant="outline" size="lg" class="flex-1"> Buy Now </Button>
      <Button size="lg" class="flex-1">
        <ShoppingCart class="mr-2 size-4" />
        Add to Cart
      </Button>
    </div>
  </div>
</template>
