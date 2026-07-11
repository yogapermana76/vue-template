<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'
  import { voucherStatusMeta } from '../constants'
  import type { VoucherStatus } from '../types'

  defineProps<{
    status: VoucherStatus
  }>()
</script>

<template>
  <Badge :variant="voucherStatusMeta[status].variant" dot>
    {{ voucherStatusMeta[status].label }}
  </Badge>
</template>
