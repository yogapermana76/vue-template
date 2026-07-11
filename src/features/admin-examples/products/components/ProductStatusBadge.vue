<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'
  import { productStatusMeta } from '../constants'
  import type { ProductStatus } from '../types'

  defineProps<{
    status: ProductStatus
  }>()
</script>

<template>
  <Badge :variant="productStatusMeta[status].variant" dot>
    {{ productStatusMeta[status].label }}
  </Badge>
</template>
