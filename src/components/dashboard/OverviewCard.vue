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
  <Card class="hover:border-primary-200 border-neutral-200 transition-colors">
    <CardHeader class="p-3 pb-2">
      <CardTitle class="text-sm text-neutral-800">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="p-3 pt-0">
      <div
        class="border-primary-200 bg-primary-50/50 flex h-32 items-center justify-center rounded-lg border border-dashed text-xs text-neutral-400"
      >
        <slot>Chart placeholder</slot>
      </div>
    </CardContent>
  </Card>
</template>
