<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'
  import { invoiceStatusMeta } from '../constants'
  import type { InvoiceStatus } from '../types'

  defineProps<{
    status: InvoiceStatus
  }>()
</script>

<template>
  <Badge :variant="invoiceStatusMeta[status].variant" dot>
    {{ invoiceStatusMeta[status].label }}
  </Badge>
</template>
