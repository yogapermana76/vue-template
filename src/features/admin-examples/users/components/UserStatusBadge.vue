<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'
  import { userStatusMeta } from '../constants'
  import type { UserStatus } from '../types'

  defineProps<{
    status: UserStatus
  }>()
</script>

<template>
  <Badge :variant="userStatusMeta[status].variant" dot>
    {{ userStatusMeta[status].label }}
  </Badge>
</template>
