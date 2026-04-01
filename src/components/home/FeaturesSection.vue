<script setup lang="ts">
  import type { Component } from 'vue'
  import { Zap, Shield, Smartphone, Palette, Code2, Layers } from 'lucide-vue-next'
  import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

  interface Feature {
    icon: Component
    title: string
    description: string
  }

  interface Props {
    title?: string
    subtitle?: string
    features?: Feature[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Everything You Need',
    subtitle:
      'Built with modern technologies and best practices for production-ready applications.',
    features: () => [
      {
        icon: Zap,
        title: 'Lightning Fast',
        description:
          'Powered by Vite for instant HMR and optimized production builds with tree-shaking.',
      },
      {
        icon: Shield,
        title: 'Type Safe',
        description:
          'Full TypeScript support with strict type checking, auto-completion, and better DX.',
      },
      {
        icon: Smartphone,
        title: 'Responsive Design',
        description: 'Mobile-first approach with adaptive layouts that work on any screen size.',
      },
      {
        icon: Palette,
        title: 'Beautiful UI',
        description:
          'Pre-built shadcn-vue components with dark mode support and customizable themes.',
      },
      {
        icon: Code2,
        title: 'Developer Experience',
        description: 'ESLint, Prettier, and Husky pre-configured for consistent, quality code.',
      },
      {
        icon: Layers,
        title: 'Scalable Architecture',
        description: 'Modular structure with composables, stores, and services ready to scale.',
      },
    ],
  })
</script>

<template>
  <section class="bg-secondary-50 py-12">
    <!-- Section header -->
    <div class="mb-8 px-4 text-center">
      <h2 class="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
        {{ title }}
      </h2>
      <p class="mx-auto max-w-2xl text-lg text-neutral-600">
        {{ subtitle }}
      </p>
    </div>

    <!-- Horizontal scroll -->
    <div class="scrollbar-none flex flex-nowrap gap-4 overflow-x-auto px-4">
      <Card
        v-for="feature in features"
        :key="feature.title"
        class="group hover:border-primary-300 w-64 min-w-64 shrink-0 transition-all duration-300"
      >
        <CardHeader class="p-4">
          <div class="bg-primary-100 mb-3 flex size-10 items-center justify-center rounded-lg">
            <component :is="feature.icon" class="text-primary-600 size-5" />
          </div>
          <CardTitle class="text-base text-neutral-900">{{ feature.title }}</CardTitle>
          <CardDescription class="text-sm text-neutral-500">
            {{ feature.description }}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </section>
</template>
