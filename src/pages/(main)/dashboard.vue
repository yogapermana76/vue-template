<script setup lang="ts">
  import { BarChart3, Users, ShoppingBag, TrendingUp } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/composables/auth'
  import {
    DashboardHeader,
    StatsCarousel,
    OverviewCard,
    ActivitySection,
  } from '@/components/dashboard'

  definePage({
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  })

  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

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
</script>

<template>
  <!-- Header -->
  <DashboardHeader :user-name="user?.name" @logout="handleLogout" />

  <div class="space-y-4 px-4">
    <!-- Stats Carousel -->
    <StatsCarousel :stats="stats" />

    <!-- Overview Card -->
    <OverviewCard />

    <!-- Activity Section -->
    <ActivitySection :activities="activities" />
  </div>
</template>
