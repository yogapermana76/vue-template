<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

  interface Props {
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Overview',
  })
</script>

<template>
  <Card>
    <CardHeader class="p-3 pb-2">
      <CardTitle class="text-sm">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="p-3 pt-0">
      <div
        class="text-muted-foreground flex h-32 items-center justify-center rounded-lg border border-dashed text-xs"
      >
        <slot>Chart placeholder</slot>
      </div>
    </CardContent>
  </Card>
</template>
