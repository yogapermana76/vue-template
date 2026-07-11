<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'
  import { orderStatusMeta } from '../constants'
  import type { OrderStatus } from '../types'

  defineProps<{
    status: OrderStatus
  }>()
</script>

<template>
  <Badge :variant="orderStatusMeta[status].variant" dot>
    {{ orderStatusMeta[status].label }}
  </Badge>
</template>
