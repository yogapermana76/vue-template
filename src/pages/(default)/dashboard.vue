<script setup lang="ts">
  import { BarChart3, Users, ShoppingBag, TrendingUp, LogOut } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
  import { StatsCard, ActivityItem } from '@/components/dashboard'

  definePage({
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  })

  const router = useRouter()
  const { logout, user } = useAuth()

  const stats = [
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+20.1%',
      icon: BarChart3,
    },
    { title: 'Subscribers', value: '2,350', change: '+180%', icon: Users },
    { title: 'Sales', value: '12,234', change: '+19%', icon: ShoppingBag },
    { title: 'Active', value: '573', change: '+201', icon: TrendingUp },
  ]

  const activities = [
    { title: 'New user registered', time: '1 hour ago' },
    { title: 'Order #1234 completed', time: '2 hours ago' },
    { title: 'Payment received', time: '3 hours ago' },
    { title: 'New review posted', time: '4 hours ago' },
    { title: 'Product updated', time: '5 hours ago' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }
</script>

<template>
  <div class="space-y-4 px-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground text-sm">Welcome, {{ user?.name || 'User' }}</p>
      </div>
      <Button variant="outline" size="icon" class="size-9" @click="handleLogout">
        <LogOut class="size-4" />
      </Button>
    </div>

    <!-- Stats Grid - Horizontal Scroll -->
    <div class="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :icon="stat.icon"
        class="w-32 min-w-32 shrink-0"
      />
    </div>

    <!-- Overview Card -->
    <Card>
      <CardHeader class="p-3 pb-2">
        <CardTitle class="text-sm">Overview</CardTitle>
      </CardHeader>
      <CardContent class="p-3 pt-0">
        <div
          class="text-muted-foreground flex h-32 items-center justify-center rounded-lg border border-dashed text-xs"
        >
          Chart placeholder
        </div>
      </CardContent>
    </Card>

    <!-- Recent Activity -->
    <Card>
      <CardHeader class="p-3 pb-2">
        <CardTitle class="text-sm">Recent Activity</CardTitle>
        <CardDescription class="text-xs">Latest actions</CardDescription>
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
  </div>
</template>
