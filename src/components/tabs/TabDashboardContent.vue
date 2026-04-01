<script setup lang="ts">
  import { Plus, Upload, Settings, TrendingUp } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

  const stats = [
    { label: 'Sales', value: 75, color: 'bg-primary-500' },
    { label: 'Revenue', value: 60, color: 'bg-secondary-500' },
    { label: 'Customers', value: 90, color: 'bg-success-500' },
  ]

  const quickActions = [
    {
      icon: Plus,
      label: 'Add',
      bgColor: 'bg-primary-100 hover:bg-primary-200',
      textColor: 'text-primary-700',
    },
    {
      icon: Upload,
      label: 'Export',
      bgColor: 'bg-secondary-100 hover:bg-secondary-200',
      textColor: 'text-secondary-700',
    },
    {
      icon: Settings,
      label: 'Settings',
      bgColor: 'bg-neutral-100 hover:bg-neutral-200',
      textColor: 'text-neutral-700',
    },
  ]
</script>

<template>
  <div class="space-y-4">
    <!-- Stats Overview -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Overview</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-for="stat in stats" :key="stat.label">
          <div class="mb-1 flex justify-between text-sm">
            <span class="text-muted-foreground">{{ stat.label }}</span>
            <span class="font-medium">{{ stat.value }}%</span>
          </div>
          <div class="bg-muted h-2 rounded-full">
            <div
              class="h-2 rounded-full transition-all"
              :class="stat.color"
              :style="{ width: `${stat.value}%` }"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Chart Placeholder -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          class="from-primary-50 to-secondary-50 flex h-40 items-center justify-center rounded-lg bg-linear-to-br"
        >
          <div class="text-primary-600 text-center">
            <TrendingUp class="mx-auto mb-2 size-12" :stroke-width="1" />
            <span class="text-sm">Chart visualization</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-3 gap-3">
          <Button
            v-for="action in quickActions"
            :key="action.label"
            variant="ghost"
            class="h-auto flex-col gap-2 p-3"
            :class="[action.bgColor, action.textColor]"
          >
            <component :is="action.icon" class="size-6" />
            <span class="text-xs font-medium">{{ action.label }}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
