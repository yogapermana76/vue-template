<script setup lang="ts">
  import { ShoppingBag, CircleCheck } from 'lucide-vue-next'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

  const stats = [
    { label: 'Total Orders', value: '128', color: 'text-blue-600' },
    { label: 'Revenue', value: '$2,450', color: 'text-green-600' },
  ]

  const activities = [
    {
      icon: ShoppingBag,
      title: 'New order received',
      time: '2 minutes ago',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: CircleCheck,
      title: 'Payment confirmed',
      time: '15 minutes ago',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ]
</script>

<template>
  <div class="space-y-4">
    <!-- Welcome Card -->
    <Card class="border-0 bg-linear-to-r from-blue-500 to-blue-600 text-white">
      <CardHeader>
        <CardTitle class="text-2xl text-white">Welcome Back!</CardTitle>
        <CardDescription class="text-blue-100">
          Explore our latest features and updates
        </CardDescription>
      </CardHeader>
    </Card>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4">
      <Card v-for="stat in stats" :key="stat.label">
        <CardContent class="p-4">
          <div class="text-2xl font-bold" :class="stat.color">
            {{ stat.value }}
          </div>
          <div class="text-muted-foreground text-sm">{{ stat.label }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div v-for="activity in activities" :key="activity.title" class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-full"
            :class="activity.iconBg"
          >
            <component :is="activity.icon" class="size-5" :class="activity.iconColor" />
          </div>
          <div class="flex-1">
            <div class="font-medium">{{ activity.title }}</div>
            <div class="text-muted-foreground text-xs">{{ activity.time }}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
