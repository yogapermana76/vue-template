<script setup lang="ts">
  import { ShoppingCart } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Footer } from '@/components/layout'

  const props = defineProps<{
    onAddToCart?: () => void
    onCancel?: () => void
  }>()
</script>

<template>
  <!-- Fixed Footer Actions -->
  <Footer position="fixed">
    <div class="flex gap-2 p-4">
      <Button
        variant="outline"
        class="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
        @click="props.onCancel"
      >
        Cancel
      </Button>
      <Button
        class="bg-primary-500 hover:bg-primary-600 flex-1 text-white"
        @click="props.onAddToCart"
      >
        <ShoppingCart class="mr-2 size-4" />
        Add to Cart
      </Button>
    </div>
  </Footer>
</template>
