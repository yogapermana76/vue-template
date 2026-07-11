<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import type { ActivityItem } from '../types'

  withDefaults(
    defineProps<{
      title?: string
      items: ActivityItem[]
    }>(),
    {
      title: 'Recent Activity',
    },
  )
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-muted/50 flex items-center gap-4 rounded-lg p-3"
      >
        <img
          v-if="item.avatarUrl"
          :src="item.avatarUrl"
          :alt="item.title"
          class="size-10 rounded-full object-cover"
        />
        <div v-else class="bg-primary-100 size-10 rounded-full" />
        <div class="min-w-0 flex-1">
          <p class="body-m-medium truncate">{{ item.title }}</p>
          <p class="body-caption text-muted-foreground">{{ item.timeAgo }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
