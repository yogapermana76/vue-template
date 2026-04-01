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
  <section class="py-12">
    <div class="mb-8 px-4 text-center">
      <h2 class="mb-4 text-2xl font-bold tracking-tight text-neutral-900">Quick Actions</h2>
      <p class="mx-auto max-w-2xl text-lg text-neutral-600">
        Jump right into the features and explore what's available.
      </p>
    </div>

    <!-- 2 columns grid -->
    <div class="grid grid-cols-2 gap-3 px-4">
      <RouterLink v-for="action in actions" :key="action.title" :to="action.to" class="group">
        <Card class="hover:border-primary-300 h-full transition-all duration-300 hover:shadow-md">
          <CardHeader class="p-3">
            <div
              class="bg-primary-100 group-hover:bg-primary-500 mb-2 flex size-9 items-center justify-center rounded-lg transition-colors"
            >
              <component
                :is="action.icon"
                class="text-primary-600 size-4 transition-colors group-hover:text-white"
              />
            </div>
            <CardTitle class="text-sm leading-tight text-neutral-800">{{ action.title }}</CardTitle>
            <CardDescription class="text-xs leading-tight text-neutral-500">
              {{ action.description }}
            </CardDescription>
          </CardHeader>
        </Card>
      </RouterLink>
    </div>
  </section>
</template>
