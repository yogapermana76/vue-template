<script setup lang="ts">
  import { BarChart3, Users, Package, CreditCard, TrendingUp, TrendingDown } from 'lucide-vue-next'
  import { RouterLink } from 'vue-router'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

  definePage({
    meta: {
      breadcrumb: 'Dashboard Overview',
    },
  })

  // Demo stats data
  const stats = [
    {
      title: 'Total Revenue',
      value: 'Rp 45.231.890',
      change: '+20.1%',
      trend: 'up',
      icon: CreditCard,
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Total Products',
      value: '12,234',
      change: '+19%',
      trend: 'up',
      icon: Package,
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-4.5%',
      trend: 'down',
      icon: BarChart3,
    },
  ]
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="heading-l text-foreground">Dashboard</h1>
      <p class="body-m text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in stats" :key="stat.title">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="body-m-medium text-muted-foreground">
            {{ stat.title }}
          </CardTitle>
          <component :is="stat.icon" class="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div class="heading-m">{{ stat.value }}</div>
          <p class="body-caption mt-1 flex items-center gap-1">
            <TrendingUp v-if="stat.trend === 'up'" class="text-success-500 h-3 w-3" />
            <TrendingDown v-else class="text-error-500 h-3 w-3" />
            <span :class="stat.trend === 'up' ? 'text-success-500' : 'text-error-500'">
              {{ stat.change }}
            </span>
            <span class="text-muted-foreground">from last month</span>
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Content Cards -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Recent Activity -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="i in 5" :key="i" class="bg-muted/50 flex items-center gap-4 rounded-lg p-3">
            <div class="bg-primary-100 h-10 w-10 rounded-full" />
            <div class="flex-1">
              <p class="body-m-medium">User {{ i }} made a purchase</p>
              <p class="body-caption text-muted-foreground">{{ i }} hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <RouterLink
              to="/admin/products"
              class="border-border bg-card hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors"
            >
              <div class="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
                <Package class="text-primary-600 h-5 w-5" />
              </div>
              <span class="body-m-medium">View Products</span>
            </RouterLink>
            <button
              v-for="action in ['View Reports', 'Manage Users', 'Settings']"
              :key="action"
              class="border-border bg-card hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors"
            >
              <div class="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
                <Package class="text-primary-600 h-5 w-5" />
              </div>
              <span class="body-m-medium">{{ action }}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Role-based Info -->
    <Card class="border-primary-200 bg-primary-50">
      <CardContent class="pt-6">
        <p class="body-m text-primary-800">
          <strong>Note:</strong> This dashboard demonstrates RBAC (Role-Based Access Control). Menu
          items are filtered based on user role. Try changing the
          <code class="bg-primary-100 rounded px-1">currentUserRole</code> variable in
          <code class="bg-primary-100 rounded px-1">(dashboard).vue</code> to see different menu
          items:
        </p>
        <ul class="text-primary-700 body-m mt-2 list-inside list-disc">
          <li><strong>admin:</strong> Full access to all menus</li>
          <li><strong>manager:</strong> Analytics, Products, Orders, Reports</li>
          <li><strong>staff:</strong> Products, Orders only</li>
          <li><strong>user:</strong> Dashboard only</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
