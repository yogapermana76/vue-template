<script setup lang="ts">
  import { Card, CardContent, CardHeader } from '@/components/ui/card'
  import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <Card>
    <CardHeader class="p-0">
      <Skeleton class="aspect-square w-full rounded-t-xl rounded-b-none" />
    </CardHeader>
    <CardContent class="space-y-1.5 p-2">
      <Skeleton class="h-3 w-full" />
      <Skeleton class="h-3 w-3/4" />
      <Skeleton class="h-4 w-1/2" />
    </CardContent>
  </Card>
</template>
