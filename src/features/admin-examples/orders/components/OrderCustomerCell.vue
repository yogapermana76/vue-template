<script setup lang="ts">
  import type { Order } from '../types'

  defineProps<{
    order: Order
  }>()
</script>

<template>
  <div class="min-w-0">
    <p class="body-m-medium text-foreground truncate">{{ order.customerName }}</p>
    <p class="body-caption text-muted-foreground truncate">{{ order.customerEmail }}</p>
  </div>
</template>
