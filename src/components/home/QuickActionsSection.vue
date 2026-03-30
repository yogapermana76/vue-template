<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { ShoppingBag, LayoutDashboard, Settings, BookOpen } from 'lucide-vue-next'
  import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

  interface QuickAction {
    icon: typeof ShoppingBag
    title: string
    description: string
    to: string
  }

  const actions: QuickAction[] = [
    {
      icon: ShoppingBag,
      title: 'Products',
      description: 'Browse product catalog with filtering and pagination',
      to: '/products',
    },
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'View analytics and manage your account',
      to: '/dashboard',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Configure theme, preferences, and more',
      to: '/settings',
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Learn how to use this template effectively',
      to: '/docs',
    },
  ]
</script>

<template>
  <section class="py-16 md:py-24">
    <div class="mb-12 px-4 text-center md:mb-16">
      <h2 class="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Quick Actions</h2>
      <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
        Jump right into the features and explore what's available.
      </p>
    </div>

    <!-- 2 columns grid -->
    <div class="grid grid-cols-2 gap-3 px-4">
      <RouterLink v-for="action in actions" :key="action.title" :to="action.to" class="group">
        <Card class="h-full transition-all duration-300">
          <CardHeader class="p-3">
            <div class="bg-primary/10 mb-2 flex size-9 items-center justify-center rounded-lg">
              <component :is="action.icon" class="text-primary size-4" />
            </div>
            <CardTitle class="text-sm leading-tight">{{ action.title }}</CardTitle>
            <CardDescription class="text-xs leading-tight">
              {{ action.description }}
            </CardDescription>
          </CardHeader>
        </Card>
      </RouterLink>
    </div>
  </section>
</template>
