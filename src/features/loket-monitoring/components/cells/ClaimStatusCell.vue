<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'

  defineProps<{ value?: unknown }>()
</script>

<template>
  <Badge :variant="value ? 'success' : 'warning-soft'" dot>
    {{ value ? 'Sudah Digunakan' : 'Belum Digunakan' }}
  </Badge>
</template>
