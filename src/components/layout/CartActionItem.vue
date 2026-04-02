<script setup lang="ts">
  import { computed } from 'vue'
  import { ShoppingCart } from 'lucide-vue-next'
  import { IconButton } from '@/components/ui/button'
  import { useCartStore } from '@/stores/cart'

  const props = defineProps<{
    onClick?: () => void | Promise<void>
  }>()

  const cartStore = useCartStore()

  const showBadge = computed(() => cartStore.cartCount > 0)
</script>

<template>
  <!-- Cart button with count badge -->
  <IconButton
    variant="tertiary"
    size="md"
    class="relative"
    title="Shopping Cart"
    @click="props.onClick"
  >
    <ShoppingCart />

    <!-- Badge (count) -->
    <span
      v-if="showBadge"
      class="animate-in zoom-in-75 bg-error-500 text-xxs pointer-events-none absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full font-bold text-white duration-200"
    >
      {{ cartStore.cartCount > 99 ? '99+' : cartStore.cartCount }}
    </span>
  </IconButton>
</template>
