<script setup lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
  import { Users } from 'lucide-vue-next'
  import { ActivityItem } from '@/components/dashboard'

  interface Activity {
    title: string
    time: string
  }

  interface Props {
    activities: Activity[]
    title?: string
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Recent Activity',
    description: 'Latest actions',
  })
</script>

<template>
  <Card class="hover:border-primary-200 border-neutral-200 transition-colors">
    <CardHeader class="p-3 pb-2">
      <CardTitle class="text-sm text-neutral-800">{{ title }}</CardTitle>
      <CardDescription class="text-xs text-neutral-500">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="p-3 pt-0">
      <div class="space-y-3">
        <ActivityItem
          v-for="(activity, index) in activities"
          :key="index"
          :title="activity.title"
          :description="activity.time"
          :icon="Users"
        />
      </div>
    </CardContent>
  </Card>
</template>
