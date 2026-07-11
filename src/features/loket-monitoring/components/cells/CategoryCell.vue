<script setup lang="ts">
  import { Badge } from '@/components/ui/badge'

  defineProps<{ value?: unknown }>()
</script>

<template>
  <Badge variant="secondary-soft">{{ value || '—' }}</Badge>
</template>
