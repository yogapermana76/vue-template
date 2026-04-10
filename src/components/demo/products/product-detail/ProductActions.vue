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
    <div class="flex w-full gap-3">
      <Button
        variant="secondary"
        size="md"
        class="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
        @click="props.onCancel"
      >
        Cancel
      </Button>
      <Button variant="primary" size="md" class="flex-1" @click="props.onAddToCart">
        <ShoppingCart class="mr-2 size-4" />
        Add to Cart
      </Button>
    </div>
  </Footer>
</template>
